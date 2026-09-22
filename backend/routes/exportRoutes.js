const express = require("express");

const {
  exportJSON,
  exportCSV,
} = require("../controllers/exportController");

const auth = require("../middleware/auth");

const router = express.Router();

router.get("/json", auth, exportJSON);

router.get("/csv", auth, exportCSV);

module.exports = router;