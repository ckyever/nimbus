import { prisma } from "../lib/prisma.js";

const getHomePage = async (req, res) => {
  if (res.locals.currentUser) {
    const userId = Number(res.locals.currentUser.id);
    const files = await getMostRecentFiles(userId);
    res.render("index", { title: "Nimbus", page: "pages/home", files: files });
  } else {
    res.redirect("/login");
  }
};

const getMostRecentFiles = async (userId) => {
  let results;
  try {
    results = await prisma.file.findMany({
      where: {
        user_id: userId,
        type: "FILE",
      },
      take: 10,
      orderBy: {
        modified_on: "desc",
      },
    });
  } catch {
    console.error(`Failed to get most recent files for user ID - ${userId}`);
  }
  return results;
};

export { getHomePage };
