const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const Data = require("../models/Data");


exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Data validation and transformation
    const validatedData = jsonData.map(item => ({
      name: item.name || 'Unnamed',
      age: Number(item.age) || 0,
      email: item.email || 'no-email@example.com'
    }));

    // Clear previous data and insert new
    await Data.deleteMany({});
    await Data.insertMany(validatedData);

    fs.unlinkSync(filePath); // Cleanup

    res.status(200).json({ 
      success: true,
      message: `Successfully uploaded ${validatedData.length} records`,
      data: validatedData
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error processing file",
      error: error.message 
    });
  }
};

// Manual Data Entry
exports.manualEntry = async (req, res) => {
  try {
    const { name, age, email } = req.body;

    // Validation
    if (!name || !email || age === undefined) {
      return res.status(400).json({ 
        success: false,
        message: "Name, age, and email are required" 
      });
    }

    const newData = new Data({
      name,
      age: Number(age),
      email
    });

    await newData.save();

    res.status(201).json({ 
      success: true,
      message: "Data saved successfully!",
      data: newData
    });

  } catch (error) {
    console.error("Manual Entry Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error saving data",
      error: error.message 
    });
  }
};

// Fetch Data for Visualization
exports.getData = async (req, res) => {
  try {
    const data = await Data.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json({ 
      success: true,
      count: data.length,
      data 
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching data",
      error: error.message 
    });
  }
};