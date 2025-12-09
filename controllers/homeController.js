const getHomePage = (req, res) => {
  if (res.locals.currentUser) {
    res.render("index", { title: "Nimbus", page: "pages/home" });
  } else {
    res.redirect("/login");
  }
};

export { getHomePage };
