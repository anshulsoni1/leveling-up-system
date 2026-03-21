const ModuleLog = require('../models/moduleLog.model');
const Module = require('../models/module.model');

const logActivity = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.userId;
    const { note, increment = 1 } = req.body;

    // Get module to check xpReward
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Set today's date with time zeroed out
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if log exists for this module, user, and date
    let moduleLog = await ModuleLog.findOne({
      moduleId,
      userId,
      date: today
    });

    if (moduleLog) {
      // Update existing log
      moduleLog.value += increment;
      if (note) moduleLog.note = note;
      // Note: We don't typically award XP multiple times per day unless specified
      moduleLog = await moduleLog.save();
      
      module.xp = (module.xp || 0) + (module.xpReward || 0);
      module.lastActivity = new Date();
      await module.save();

      return res.status(200).json(moduleLog);
    } else {
      // Create new log
      const xpAwarded = module.xpReward || 0;
      
      const newLog = new ModuleLog({
        moduleId,
        userId,
        date: today,
        value: increment,
        note,
        xpAwarded
      });
      
      const savedLog = await newLog.save();
      
      module.xp = (module.xp || 0) + xpAwarded;
      module.lastActivity = new Date();
      await module.save();

      return res.status(201).json(savedLog);
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Log already exists for this date', error: error.message });
    }
    res.status(500).json({ message: 'Error logging activity', error: error.message });
  }
};


const getAllLogs = async (req, res) => {
  try {
    const logs = await ModuleLog.find({ userId: req.userId }).sort({ date: -1 });

    const grouped = {
      books: [],
      dsa: [],
      skills: [],
      custom: []
    };

    logs.forEach(log => {
      if (['books', 'dsa', 'skills'].includes(log.moduleId)) {
        grouped[log.moduleId].push(log);
      } else {
        grouped.custom.push(log);
      }
    });

    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all logs', error: error.message });
  }
};

const getModuleLogs = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const logs = await ModuleLog.find({ moduleId, userId: req.userId }).sort({ date: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching module logs', error: error.message });
  }
};

const deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;
    
    const logToDelete = await ModuleLog.findOne({ _id: logId, userId: req.userId });
    
    if (!logToDelete) {
      return res.status(404).json({ message: 'Log not found or not authorized to delete' });
    }
    
    await ModuleLog.findByIdAndDelete(logId);
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting log', error: error.message });
  }
};

module.exports = { logActivity, getModuleLogs, getAllLogs, deleteLog };
