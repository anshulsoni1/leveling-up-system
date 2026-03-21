const User = require('../models/user.model');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email xp level rank quests displayName avatarUrl');
    if (!user) {
      return res.status(200).json({ email: '', xp: 0, level: 1, rank: 'E', quests: [], displayName: 'Shadow Monarch', avatarUrl: 'assets/images/placeholder.jpg' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { displayName, avatarUrl } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (displayName !== undefined) user.displayName = displayName;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const updateState = async (req, res) => {
  try {
    const { xp, quests, level } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (xp !== undefined) user.xp = xp;
    if (level !== undefined) user.level = level;
    if (quests !== undefined) user.quests = quests;
    
    // Recalculate level from XP if level not explicitly provided
    if (xp !== undefined && level === undefined) {
      user.level = Math.floor(user.xp / 100) + 1;
    }

    await user.save();

    res.status(200).json({ xp: user.xp, level: user.level, quests: user.quests });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateXP = async (req, res) => {
  try {
    const { delta } = req.body;
    if (typeof delta !== 'number') {
      return res.status(400).json({ message: 'XP delta must be a number' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(200).json({ email: '', xp: 0, level: 1, rank: 'E', quests: [], displayName: 'Shadow Monarch', avatarUrl: 'assets/images/placeholder.jpg' });
    }

    user.xp += delta;
    user.level = Math.floor(user.xp / 100) + 1;
    await user.save();

    res.status(200).json({ xp: user.xp, level: user.level });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateQuests = async (req, res) => {
  try {
    const { quests } = req.body;
    if (!Array.isArray(quests)) {
      return res.status(400).json({ message: 'Quests must be an array' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(200).json({ email: '', xp: 0, level: 1, rank: 'E', quests: [] });
    }

    user.quests = quests;
    await user.save();

    res.status(200).json(user.quests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMe, updateProfile, updateState, updateXP, updateQuests };
