const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const employeeRoutes = require("./employeeRoutes");
const userRoutes = require("./userRoutes");
dotenv.config();
const db = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json());


const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({limit: '5000mb', extended: true}));
app.use(express.json({limit: '5000mb'}));

mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {    
    console.log(`Server running on http://localhost:${port}`);
});


app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes);