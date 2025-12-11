import { prisma } from "../lib/prisma.js";
import { upload } from "./cloud.js";
import * as fs from "fs/promises";

const uploadFile = async (req, res) => {
  const filename = req.file.originalname;
  const userId = res.locals.currentUser.id;
  const parentFolderId = Number(req.body["parent-folder-id"]);
  const size = req.file.size;

  const cloudUrl = await upload(req.file.path);
  await fs.unlink(req.file.path);

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
        url: cloudUrl,
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
        url: cloudUrl,
      },
    });
  }

  res.json({ success: true });
};

export { uploadFile };
