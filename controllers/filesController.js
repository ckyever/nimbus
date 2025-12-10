import { prisma } from "../lib/prisma.js";

const getFilesPage = async (req, res) => {
  if (res.locals.currentUser) {
    const userId = res.locals.currentUser.id;
    const folderId = await getFoldersId(userId, req.path);
    if (folderId) {
      const files = await getFiles(userId, folderId);
      console.log(files);
      res.render("index", {
        title: "Nimbus | Files",
        page: "pages/files",
        path: req.path,
        currentFolderId: folderId,
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

const getFoldersId = async (userId, folderPath) => {
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

  // Path starts with '/' so first element is empty
  const folders = folderPath.split("/").slice(1);
  let currentFolderId = rootFolderId;
  for (const folder of folders) {
    if (folder.length > 0) {
      let results;
      try {
        results = await prisma.file.findMany({
          where: {
            user_id: userId,
            parent_id: currentFolderId,
            name: folder,
            type: "FOLDER",
          },
        });
      } catch {
        console.error("Failed to check if folder exists");
        return null;
      }

      if (results.length === 1) {
        currentFolderId = results[0].id;
      } else {
        return null;
      }
    }
  }

  return currentFolderId;
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

export { getFilesPage };
