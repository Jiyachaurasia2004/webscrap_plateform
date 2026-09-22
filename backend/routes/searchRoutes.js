const express = require("express");

const { search } = require("../controllers/searchController");

const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, search);

module.exports = router;