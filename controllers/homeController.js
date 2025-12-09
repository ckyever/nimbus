const getHomePage = (req, res) => {
  res.render("index", { title: "Nimbus", page: "pages/home" });
};

export { getHomePage };
