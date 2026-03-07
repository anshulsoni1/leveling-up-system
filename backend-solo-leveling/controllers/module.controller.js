const Module = require('../models/module.model');

const createModule = async (req, res) => {
  try {
    const { name, icon, color, category, trackingType } = req.body;
    
    const newModule = new Module({
      userId: req.userId,
      name,
      icon,
      color,
      category,
      trackingType
    });
    
    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating module', error: error.message });
  }
};

const getUserModules = async (req, res) => {
  try {
    const modules = await Module.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules', error: error.message });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const moduleToDelete = await Module.findOne({ _id: id, userId: req.userId });
    
    if (!moduleToDelete) {
      return res.status(404).json({ message: 'Module not found or not authorized to delete' });
    }
    
    await Module.findByIdAndDelete(id);
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error: error.message });
  }
};

module.exports = { createModule, getUserModules, deleteModule };
