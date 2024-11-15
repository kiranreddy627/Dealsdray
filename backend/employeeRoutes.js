const express = require("express");
const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployee,
} = require("./employeeController");

const router = express.Router();

// Routes
router.post("/create", createEmployee); // Create with image upload
router.put("/update/:id", updateEmployee); // Update with optional image upload
router.delete("/delete/:id", deleteEmployee); // Delete an employee
router.get("/getall", getAllEmployee); // Fetch all employees

module.exports = router;
