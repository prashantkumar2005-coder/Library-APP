import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [edit, setEdit] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
  });

  // Fetch books on load
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/library", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data.data);
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    }
  };

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (edit) {
        await api.put(`/library/${edit}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEdit(null);
      } else {
        await api.post("/library", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetchBooks();

      setFormData({
        title: "",
        author: "",
        price: "",
      });
    } catch (err) {
      console.log("Creation Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Edit
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price,
    });

    setEdit(book._id);
  };

  // Handle Delete — ✅ Fixed: was `}};` now correctly `};`
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.delete(`/library/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        fetchBooks();
      }
    } catch (err) {
      console.log("Delete Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-white mb-10 text-center tracking-wide">
          📚 Library Dashboard
        </h1>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            {edit ? "Update Book" : "Add New Book"}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Book Title"
              className="bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Author Name"
              className="bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="bg-white/20 text-white placeholder-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="md:col-span-3 text-center">
              <button
                type="submit"
                className={`px-8 py-3 rounded-xl text-white font-semibold shadow-lg transition duration-300 transform hover:scale-105 ${
                  edit
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {edit ? "Update Book" : "Add Book"}
              </button>
            </div>
          </form>
        </div>

        {/* Books Section */}
        <h2 className="text-2xl font-semibold text-white mb-6">
          All Books
        </h2>

        {books.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No books available. Add your first book 🚀
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow-xl p-6 transition transform hover:-translate-y-2 hover:shadow-2xl duration-300"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {book.title}
                </h3>

                <p className="text-gray-600 mb-1">
                  <span className="font-semibold">Author:</span> {book.author}
                </p>

                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">Price:</span> ₹ {book.price}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(book)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white py-2 rounded-lg font-medium transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}