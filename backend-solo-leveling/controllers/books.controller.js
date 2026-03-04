const Book = require('../models/books.model');

const getBooks = async (req, res) => {
  try {
    const bookContent = await Book.findOne({ userId: req.userId });
    if (!bookContent) {
      return res.status(200).json({ currentBook: '', totalPages: 0, pagesRead: 0, logs: [] });
    }
    res.status(200).json(bookContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBooks = async (req, res) => {
  try {
    const { currentBook, totalPages, pagesRead } = req.body;
    const updateData = { currentBook, totalPages, pagesRead };

    const bookContent = await Book.findOneAndUpdate(
      { userId: req.userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.status(200).json(bookContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addLog = async (req, res) => {
  try {
    const { pages } = req.body;
    if (typeof pages !== 'number') {
      return res.status(400).json({ message: 'Pages must be a number' });
    }

    const bookContent = await Book.findOne({ userId: req.userId });
    if (!bookContent) {
      return res.status(404).json({ message: 'Books progress not found' });
    }

    bookContent.logs.push({ pages });
    bookContent.pagesRead += pages;

    await bookContent.save();
    res.status(200).json(bookContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBooks, updateBooks, addLog };
