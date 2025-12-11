import { prisma } from "../lib/prisma.js";

const uploadFile = async (req, res) => {
  const filename = req.file.originalname;
  const userId = res.locals.currentUser.id;
  const parentFolderId = Number(req.body["parent-folder-id"]);
  const fileUrl = req.file.path;
  const size = req.file.size;

  const existingFile = await prisma.file.findFirst({
    where: {
      name: filename,
      user_id: userId,
      parent_id: parentFolderId,
      type: "FILE",
    },
  });

  if (existingFile) {
    await prisma.file.update({
      data: {
        id: existingFile.id,
        url: fileUrl,
        size: size,
        modified_on: new Date(),
      },
      where: {
        id: existingFile.id,
      },
    });
  } else {
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        type: "FILE",
        user_id: res.locals.currentUser.id,
        parent_id: Number(req.body["parent-folder-id"]),
        size: size,
        url: fileUrl,
      },
    });
  }

  res.json({ success: true });
};

export { uploadFile };
