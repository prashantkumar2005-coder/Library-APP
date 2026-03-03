const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");


const authVerify = async (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = req.headers.authorization.split(" ")[1];
        const JWT_SECRET_KEY = "firstproject123";
        const decodedUser = jwt.verify(token, JWT_SECRET_KEY);

        const email = decodedUser.existingUser.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized user" });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("auth err", err.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}
module.exports = authVerify;