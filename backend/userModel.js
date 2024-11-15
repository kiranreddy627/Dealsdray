const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
       type : mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
},{timestamps: true});

module.exports = mongoose.model("User", userSchema);