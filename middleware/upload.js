const express = require("express");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "Productimage") {
      cb(null, path.join(__dirname, '..', process.env.PRODUCT_IMAGES_PATH));
    }
    if (file.fieldname === "Extraimages") {
      cb(null, path.join(__dirname, '..', process.env.UPLOAD_EXTRA_PATH));
    }
},
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});



const uploadProductMedia = multer({ storage: storage,limits: {fileSize: 1024 * 1024 * 5,},}).fields([
    { name: 'Productimage', maxCount: 1 },
    { name: 'Extraimages', maxCount: 10 }
  ]);
module.exports = {uploadProductMedia}
