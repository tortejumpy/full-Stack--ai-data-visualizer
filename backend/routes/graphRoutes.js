const express = require("express");
const { generateGraph } = require("../controllers/graphController");

const router = express.Router();

router.get("/generate-graph", generateGraph);


router.get("/3d-data", async (req, res) => {
    try {
      const data = await Data.find().lean();
      res.json(data); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;