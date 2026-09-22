const express = require("express");

const {
  scrape,
  getScrapedData,
  deleteScrapedData,
} = require("../controllers/scraperController");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, scrape);

router.get("/", auth, getScrapedData);

router.delete("/:id", auth, deleteScrapedData);

module.exports = router;