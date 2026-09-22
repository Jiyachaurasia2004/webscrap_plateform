const express = require("express");

const {
  getSearchHistory,
  deleteSearchHistory,
} = require("../controllers/historyController");

const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, getSearchHistory);

router.delete("/:id", auth, deleteSearchHistory);

module.exports = router;