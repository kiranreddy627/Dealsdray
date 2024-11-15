const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    id: {
       type : mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    mobile: {
        type: String,
        unique: true
    },
    desg: {
        enum : ["HR", "sales","Manager"],
        type: String
    },
    gender : {
        type: String,
        enum: ["Male", "Female"]
    },
    course: [{
        type: String,
        enum: ["BSC", "BCA", "MCA"]
    }],
    image: {
        type: String
    }
},{timestamps: true});

const employee = mongoose.model("employee", employeeSchema);
module.exports = employee