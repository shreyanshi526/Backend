const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
    const { username, Email, password, PhoneNumber, City } = req.body;
    if (!username || !Email || !password || !PhoneNumber || !City) {
        res.status(404);
        throw new Error("All fields are mandatory.");
    }
    const userAvailable = await User.findOne({ Email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // Create new user
    const user = await User.create({
        username,
        Email,
        password: hashedPassword,
        PhoneNumber,
        City
    });

    if (user) {
        res.status(201).json({
            message: "Registered successfully",
            _id: user.id,
            _Email: user.Email
        });
    } else {
        res.status(400);
        throw new Error("Enter valid data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { Email, password } = req.body;

    if (!Email || !password) {
        res.status(404);
        throw new Error("All fields are mandatory.");
    }

    const user = await User.findOne({ Email });

    // Check if the user exists
    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }

    console.log("Hashed Password Length:", user.password.length);
    console.log("Plaintext Password Length:", password.length);


    console.log(user.password);
    console.log(password)
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                Email: user.Email,
                id: user.id
            }
        }, process.env.ACCES_TOKEN_SECRET, { expiresIn: "1hr" });

        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email/Password not matched");
    }
});


const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user info" });
});

module.exports = { registerUser, loginUser, currentUser };
