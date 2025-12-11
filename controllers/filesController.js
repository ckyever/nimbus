import { prisma } from "../lib/prisma.js";

const getFilesPage = async (req, res) => {
  if (res.locals.currentUser) {
    let folderId = Number(req.params.folder_id);
    const userId = Number(res.locals.currentUser.id);

    if (!folderId) {
      folderId = Number(await getUsersRootFolder(userId, req.path));
    }

    if (folderId) {
      const files = await getFiles(userId, folderId);
      const parentFolderId = await getParentFolder(userId, folderId);
      res.render("index", {
        title: "Nimbus | Files",
        page: "pages/files",
        path: req.path,
        currentFolderId: folderId,
        parentFolderId: parentFolderId,
        files: files,
      });
    } else {
      res.status(404).render("index", {
        title: "Nimbus",
        page: "pages/folder_error",
      });
    }
  } else {
    res.redirect("/login");
  }
};

const getUsersRootFolder = async (userId) => {
  let rootFolderId;
  try {
    const results = await prisma.file.findMany({
      where: {
        user_id: userId,
        parent_id: null,
        type: "FOLDER",
      },
      select: {
        id: true,
      },
    });
    rootFolderId = results[0].id;
  } catch {
    console.error("Failed to find user's root folder");
    return null;
  }

  return rootFolderId;
};

const getFiles = async (userId, folderId) => {
  let results;
  try {
    results = await prisma.file.findMany({
      where: {
        user_id: userId,
        parent_id: folderId,
      },
    });
  } catch {
    console.error(`Failed to get files from folder ID - ${folderId}`);
  }
  return results;
};

const getParentFolder = async (userId, folderId) => {
  let results;
  try {
    results = await prisma.file.findUnique({
      where: {
        user_id: userId,
        id: folderId,
      },
      select: {
        parent_id: true,
      },
    });
  } catch {
    console.error(`Failed to get parent folder ID for - ${folderId}`);
  }
  return results.parent_id;
};

const deleteFile = async (req, res) => {
  const fileId = req.params.file_id;
  try {
    await prisma.file.delete({
      where: {
        id: Number(fileId),
      },
    });
    res.json({ success: true });
  } catch {
    console.error(`Failed to delete file - ${fileId}`);
    res.json({ success: false });
  }
};

export { getFilesPage, deleteFile };
