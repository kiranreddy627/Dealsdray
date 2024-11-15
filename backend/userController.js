const User = require("./userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, "secret");
        res.status(200).json({ token, username: user.name });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}  

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ userId: user._id }, "secret");
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { loginUser, registerUser };