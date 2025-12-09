import { prisma } from "../lib/prisma.js";

const getUsername = async (req, res) => {
  const username = req.params.username;
  if (username) {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (user) {
      res.json({ success: true, user: user });
    } else {
      res.json({ success: false, users: null });
    }
  }
};

export { getUsername };
