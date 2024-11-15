import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeMobile, setEmployeeMobile] = useState("");
  const [employeeDesg, setEmployeeDesg] = useState("HR");
  const [employeeGender, setEmployeeGender] = useState("Male");
  const [employeeCourse, setEmployeeCourse] = useState([]);
  const [employeeImage, setEmployeeImage] = useState(null); // Store file instead of Base64
  const [showModal, setShowModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState({ field: "name", order: "asc" });
  const [errors, setErrors] = useState({});
  const username = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees/getall");
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!employeeEmail || !emailRegex.test(employeeEmail)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!employeeMobile || !phoneRegex.test(employeeMobile)) {
      newErrors.mobile = "Please enter a valid 10-digit phone number.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB. Please upload a smaller file.");
        return;
      }
      setEmployeeImage(file); // Store the file directly
    }
  };

  const handleCreateOrEditEmployee = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", employeeName);
    formData.append("email", employeeEmail);
    formData.append("mobile", employeeMobile);
    formData.append("desg", employeeDesg);
    formData.append("gender", employeeGender);
    formData.append("course", JSON.stringify(employeeCourse)); // Convert array to JSON string
    if (employeeImage) formData.append("image", employeeImage); // Append the file only if available

    try {
      if (editEmployeeId) {
        // Update existing employee
        await axios.put(
          `http://localhost:5000/api/employees/update/${editEmployeeId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Add new employee
        await axios.post("http://localhost:5000/api/employees/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      handleModalClose();
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error.response?.data || error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/delete/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(value) ||
        employee.email.toLowerCase().includes(value) ||
        employee.mobile.toLowerCase().includes(value)
    );
    setFilteredEmployees(filtered);
  };

  const handleSort = (field) => {
    const order = sortOrder.field === field && sortOrder.order === "asc" ? "desc" : "asc";
    setSortOrder({ field, order });
    const sorted = [...filteredEmployees].sort((a, b) =>
      order === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
    );
    setFilteredEmployees(sorted);
  };

  const handleEditEmployee = (employee) => {
    setEmployeeName(employee.name);
    setEmployeeEmail(employee.email);
    setEmployeeMobile(employee.mobile);
    setEmployeeDesg(employee.desg);
    setEmployeeGender(employee.gender);
    setEmployeeCourse(employee.course || []);
    setEmployeeImage(null); // Clear the file input for edits
    setEditEmployeeId(employee._id);
    setShowModal(true);
  };

  const resetFormState = () => {
    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeMobile("");
    setEmployeeDesg("HR");
    setEmployeeGender("Male");
    setEmployeeCourse([]);
    setEmployeeImage(null);
    setEditEmployeeId(null);
    setErrors({});
  };

  const handleModalClose = () => {
    resetFormState();
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            Home
          </Link>
          <span className="ms-auto">{username}</span>
          <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <button className="btn btn-primary mb-4" onClick={() => setShowModal(true)}>
          Add Employee
        </button>

        <div className="d-flex align-items-center mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search employees"
            value={search}
            onChange={handleSearch}
          />
          <button className="btn btn-secondary me-2" onClick={() => handleSort("name")}>
            Sort by Name
          </button>
          <button className="btn btn-secondary" onClick={() => handleSort("desg")}>
            Sort by Designation
          </button>
        </div>

        <table className="table table-hover shadow-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Designation</th>
              <th>Courses</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobile}</td>
                <td>{employee.desg}</td>
                <td>{employee.course.join(", ")}</td>
                <td>
                  {employee.image && (
                    <img
                      src={`http://localhost:5000/${employee.image}`}
                      alt={employee.name}
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditEmployee(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteEmployee(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editEmployeeId ? "Edit Employee" : "Add Employee"}
                </h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                      type="text"
                      className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                      value={employeeMobile}
                      onChange={(e) => setEmployeeMobile(e.target.value)}
                    />
                    {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Designation</label>
                    <select
                      className="form-control"
                      value={employeeDesg}
                      onChange={(e) => setEmployeeDesg(e.target.value)}
                    >
                      <option value="HR">HR</option>
                      <option value="Sales">Sales</option>
                      <option value="Manager">Manager</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <div className="d-flex">
                      <label className="me-3">
                        <input
                          type="radio"
                          value="Male"
                          checked={employeeGender === "Male"}
                          onChange={() => setEmployeeGender("Male")}
                        />
                        Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="Female"
                          checked={employeeGender === "Female"}
                          onChange={() => setEmployeeGender("Female")}
                        />
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Courses</label>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value="BCA"
                        checked={employeeCourse.includes("BCA")}
                        onChange={() =>
                          setEmployeeCourse((prev) =>
                            prev.includes("BCA")
                              ? prev.filter((item) => item !== "BCA")
                              : [...prev, "BCA"]
                          )
                        }
                      />
                      <label className="form-check-label">BCA</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value="MCA"
                        checked={employeeCourse.includes("MCA")}
                        onChange={() =>
                          setEmployeeCourse((prev) =>
                            prev.includes("MCA")
                              ? prev.filter((item) => item !== "MCA")
                              : [...prev, "MCA"]
                          )
                        }
                      />
                      <label className="form-check-label">MCA</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value="BSC"
                        checked={employeeCourse.includes("BSC")}
                        onChange={() =>
                          setEmployeeCourse((prev) =>
                            prev.includes("BSC")
                              ? prev.filter((item) => item !== "BSC")
                              : [...prev, "BSC"]
                          )
                        }
                      />
                      <label className="form-check-label">BSC</label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Employee Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImageChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleModalClose}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleCreateOrEditEmployee}>
                  {editEmployeeId ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
