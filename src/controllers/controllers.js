const uploadFile = require("../middleware/upload");
const fs = require("fs");
const path = require("path");
const baseUrl = "http://localhost:8080";
const axios = require("axios");

const downloadImage = async (url, destination) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream", // Ensure the response is treated as a stream
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(destination);
    response.data.pipe(writer);

    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const uploadFromLink = async (req, res) => {
  const baseUploadDir = path.join(__basedir, "uploads");
  
  try {
    if (req.body.imageUrl) {
      const imageUrl = req.body.imageUrl;
      const fileName = path.basename(new URL(imageUrl).pathname); // Extract filename from URL
      const destination = path.join(baseUploadDir, fileName);

      await downloadImage(imageUrl, destination);
      return res.status(200).send({
        message: "Downloaded and stored the file successfully: " + fileName,
        filePath: `${baseUrl}/uploads/${fileName}`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + "/uploads/" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
  uploadFromLink
};