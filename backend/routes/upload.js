const express = require("express");
const { uploadImages } = require("../controllers/upload");

const router = express.Router();

router.post("/uploadImages", uploadImages);

module.exports = router;