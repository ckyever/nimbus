const getUploadPage = (req, res) => {
  res.render("index", { title: "Nimbus", page: "pages/upload" });
};

const uploadFile = (req, res) => {
  console.log(req.file.path);
  res.redirect("/");
};

export { getUploadPage, uploadFile };
