const getUploadPage = (req, res) => {
  if (res.locals.currentUser) {
    res.render("index", { title: "Nimbus", page: "pages/upload" });
  } else {
    res.redirect("/login");
  }
};

const uploadFile = (req, res) => {
  console.log(req.file.path);
  res.redirect("/");
};

export { getUploadPage, uploadFile };
