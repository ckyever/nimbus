import { prisma } from "../lib/prisma.js";

const createFolder = async (req, res) => {
  const folder = await prisma.file.create({
    data: {
      name: req.body["folder-name"],
      type: "FOLDER",
      user_id: res.locals.currentUser.id,
      parent_id: Number(req.body["parent-folder-id"]),
    },
  });
  res.json({ success: true, folder });
};

export { createFolder };
