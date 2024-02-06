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

    // compare password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accesstoken = jwt.sign({
            user: {
                username: user.username,
                Email: user.Email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECRET)
        { expireIN: "1hr" }
        res.status(200).json({ accesstoken })
    }
    else {
        res.status(401)
        throw new Error("email/password not matched")
    }
});


const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user info" });
});

const CreateProfile = asyncHandler(async (req, res) => {
    const { FullName, Gender, Address } = req.body;
    const user = req.user;
    const userId = user.id;
    await User.findByIdAndUpdate(userId, {
        $set: {
            FullName,
            Gender,
            Address
        }
    });
    res.status(200).json({ message: "Profile completed successfully" });
});

const EditProfile = asyncHandler(async (req, res) => {
    const { FullName, Gender, Email, PhoneNumber, City, Address } = req.body;
    const user = req.user;
    const userId = user.id;
    await User.findByIdAndUpdate(userId, {
        $set: {
            FullName,
            Gender,
            Email,
            PhoneNumber,
            City,
            Address
        }
    });
    res.status(200).json({ message: "Profile updated successfully" });
});

const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword,previousPassword } = req.body;
    const user = req.user;
    const userId = user.id;

    if (user.id && (await bcrypt.compare(previousPassword, user.password))) {
        // Hash password
        const hashedPassword = await bcrypt.hash(currentPassword,10);
        await User.findByIdAndUpdate(userId, {
            $set: {
                password: hashedPassword,
            }
        });
        res.status(200).json({ message: "Password updated successfully" });
    }
});

module.exports = { registerUser, loginUser, currentUser, CreateProfile, EditProfile,updatePassword };
