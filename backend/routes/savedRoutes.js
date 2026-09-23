const express = require("express");

const {
  saveItem,
  getSavedItems,
  deleteSavedItem,
} = require("../controllers/savedController");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, saveItem);

router.get("/", auth, getSavedItems);

router.delete("/:id", auth, deleteSavedItem);

module.exports = router;