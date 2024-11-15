const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const employee = require("./employeeModel");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; // Allow only image files
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed!"));
    }
  },
});

// Create Employee
const createEmployee = async (req, res) => {
  try {
    const { name, email, mobile, desg, gender, course } = req.body;

    const newEmployee = await employee.create({
      name,
      email,
      mobile,
      desg,
      gender,
      course: course ? JSON.parse(course) : [], // Safely parse course if provided
      image: req.file ? req.file.path : null, // Save file path
    });

    res.status(200).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Employee
const updateEmployee = async (req, res) => {
  try {
    const { name, email, mobile, desg, gender, course } = req.body;

    const updatedData = {
      name,
      email,
      mobile,
      desg,
      gender,
      course: course ? JSON.parse(course) : [], // Safely parse course if provided
    };

    // Update image if a new file is uploaded
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedEmployee = await employee.findOneAndUpdate(
      { _id: req.params.id },
      updatedData,
      { new: true } // Return updated document
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await employee.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(deletedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Employees
const getAllEmployee = async (req, res) => {
  try {
    const employees = await employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createEmployee: [upload.single("image"), createEmployee], // Attach Multer middleware
  updateEmployee: [upload.single("image"), updateEmployee], // Attach Multer middleware
  deleteEmployee,
  getAllEmployee,
};
