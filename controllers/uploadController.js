import { prisma } from "../lib/prisma.js";

const uploadFile = async (req, res) => {
  // CKYTODO: If file name already exists in current folder do an update instead
  await prisma.file.create({
    data: {
      name: req.file.originalname,
      type: "FILE",
      user_id: res.locals.currentUser.id,
      parent_id: Number(req.body["parent-folder-id"]),
      size: req.file.size,
      url: req.file.path,
    },
  });
  res.json({ success: true });
};

export { uploadFile };
