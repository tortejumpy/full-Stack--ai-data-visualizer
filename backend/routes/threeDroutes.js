const express = require("express");
const router = express.Router();
const { get3DData } = require("../controllers/threeDController");


router.get("/3d-data", get3DData);

module.exports = router;