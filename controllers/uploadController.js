const uploadFile = (req, res) => {
  console.log(req.file.path);
  res.json({ success: true });
};

export { uploadFile };
