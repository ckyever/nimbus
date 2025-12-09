const getLoginPage = (req, res) => {
  const errorMessage = req.flash("error");
  if (res.locals.currentUser) {
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Nimbus | Login",
      errorMessage: errorMessage[0],
    });
  }
};

export { getLoginPage };
