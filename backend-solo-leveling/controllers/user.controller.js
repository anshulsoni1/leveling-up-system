const User = require('../models/user.model');

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email xp level rank quests');
    if (!user) {
      return res.status(200).json({ email: '', xp: 0, level: 1, rank: 'E', quests: [] });
    }
    res.status(200).json(user);
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
      return res.status(200).json({ email: '', xp: 0, level: 1, rank: 'E', quests: [] });
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

module.exports = { getMe, updateXP, updateQuests };
