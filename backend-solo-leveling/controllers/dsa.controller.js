const DSA = require('../models/dsa.model');

const getDSA = async (req, res) => {
  try {
    const dsaContent = await DSA.findOne({ userId: req.userId });
    if (!dsaContent) {
      return res.status(200).json({ categories: [] });
    }
    res.status(200).json(dsaContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDSA = async (req, res) => {
  try {
    const { categories } = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({ message: 'Categories must be an array' });
    }

    const dsaContent = await DSA.findOneAndUpdate(
      { userId: req.userId },
      { $set: { categories } },
      { new: true, upsert: true }
    );

    res.status(200).json(dsaContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const dsaContent = await DSA.findOne({ userId: req.userId });
    if (!dsaContent) {
      const newDsa = new DSA({
        userId: req.userId,
        categories: [{ name, topics: [] }]
      });
      await newDsa.save();
      return res.status(200).json(newDsa);
    }

    dsaContent.categories.push({ name, topics: [] });
    await dsaContent.save();
    res.status(200).json(dsaContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addTopic = async (req, res) => {
  try {
    const { categoryName, topicName } = req.body;
    if (!categoryName || !topicName) {
      return res.status(400).json({ message: 'Category name and topic name are required' });
    }

    const dsaContent = await DSA.findOne({ userId: req.userId });
    if (!dsaContent) {
      return res.status(404).json({ message: 'DSA progress not found' });
    }

    const category = dsaContent.categories.find(c => c.name === categoryName);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.topics.push({ name: topicName, solved: 0 });
    await dsaContent.save();
    res.status(200).json(dsaContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDSA, updateDSA, addCategory, addTopic };
