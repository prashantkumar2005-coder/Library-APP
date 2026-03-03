const express = require("express");
const router = express.Router();
const Book = require("../model/book.js");
const authVerify = require('../auth/authVerify.js');
const User = require('../model/user.js');


// ── GET /library ──────────────────────────────────────────────────────────────
// Fetches all books from the database and returns them
router.get("/library", async (req, res) => {
    try {
        const book = await Book.find();
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching books"
        });
    }
});


// ── GET /store ────────────────────────────────────────────────────────────────
router.get('/store', authVerify, async (req, res) => {
    try {
        const user = req.user;
        const { email } = user;

        const userDetails = await User.findOne({ email: email })

        return res.status(200).json({
            success: true,
            data: userDetails,
        });

    } catch (err) {
        console.log("store route err", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error", // ✏️ EDITED: flipped the order so err.message is used first
        });
    }
// ✏️ EDITED: removed the stray "1" that was here — it was a syntax error
});


// ── POST /library ─────────────────────────────────────────────────────────────
// ✏️ EDITED: added authVerify — only logged in users can create books
router.post("/library", authVerify, async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({
                success: false,
                message: "please fill all details (title , author , price )"
            });
        }

        let newBook = new Book({
            title,
            author,
            price,
            createdBy: req.user._id // ✏️ EDITED: saving who created the book using req.user from authVerify
        });

        await newBook.save();

        res.status(200).json({
            success: true,
            message: "Book Created Successfully",
            data: newBook,
        });

    } catch (err) {
        console.log("creation error - 111", err.message);
        return res.status(500).json({
            success: false,
            message: "Server not working",
        });
    }
});


// ── PUT /library/:id ──────────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — update an existing book (protected)
router.put("/library/:id", authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price, description, image } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, price, description, image },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.status(200).json({
            success: true,
            message: "Book Updated Successfully",
            data: updatedBook
        });

    } catch (err) {
        console.log("update error", err.message);
        res.status(500).json({ success: false, message: "Update failed" });
    }
});


// ── DELETE /library/:id ───────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — delete a book (protected)
router.delete("/library/:id", authVerify, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        res.status(200).json({ success: true, message: "Book deleted successfully" });

    } catch (err) {
        console.log("delete error", err.message);
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});


// ── POST /library/:id/buy ─────────────────────────────────────────────────────
// ✏️ EDITED: entire route added — buy a book, saves it to user's purchasedBooks (protected)
router.post("/library/:id/buy", authVerify, async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const user = await User.findById(req.user._id);

        // check if already purchased
        if (user.purchasedBooks.includes(id)) {
            return res.status(400).json({ success: false, message: "Book already purchased" });
        }

        user.purchasedBooks.push(id);
        await user.save();

        res.status(200).json({ success: true, message: "Book purchased successfully" });

    } catch (err) {
        console.log("buy error", err.message);
        res.status(500).json({ success: false, message: "Purchase failed" });
    }
});


module.exports = router;