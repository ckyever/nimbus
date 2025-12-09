const getFilesPage = (req, res) => {
  console.log(req.path);
  if (res.locals.currentUser) {
    res.render("index", {
      title: "Nimbus | Files",
      page: "pages/files",
      path: req.path,
    });
  } else {
    res.redirect("/login");
  }
};

export { getFilesPage };
