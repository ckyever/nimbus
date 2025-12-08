const getHomePage = (req, res) => {
  res.render("home", { title: "Hello World" });
};

export { getHomePage };
