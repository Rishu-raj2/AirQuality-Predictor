const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

router.get("/prediction", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "prediction.html"));
});

router.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "about.html"));
});

module.exports = router;
