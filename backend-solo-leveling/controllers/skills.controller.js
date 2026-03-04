const Skill = require('../models/skills.model');

const getSkills = async (req, res) => {
  try {
    const skillsContent = await Skill.findOne({ userId: req.userId });
    if (!skillsContent) {
      return res.status(200).json({ skills: [] });
    }
    res.status(200).json(skillsContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const skillsContent = await Skill.findOneAndUpdate(
      { userId: req.userId },
      { $set: { skills } },
      { new: true, upsert: true }
    );

    res.status(200).json(skillsContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addSkill = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const skillsContent = await Skill.findOne({ userId: req.userId });
    if (!skillsContent) {
      const newDsa = new Skill({
        userId: req.userId,
        skills: [{ name, xp: 0, level: 1, logs: [] }]
      });
      await newDsa.save();
      return res.status(200).json(newDsa);
    }

    skillsContent.skills.push({ name, xp: 0, level: 1, logs: [] });
    await skillsContent.save();
    res.status(200).json(skillsContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addLog = async (req, res) => {
  try {
    const { skillName, text } = req.body;
    if (!skillName || !text) {
      return res.status(400).json({ message: 'Skill name and log text are required' });
    }

    const skillsContent = await Skill.findOne({ userId: req.userId });
    if (!skillsContent) {
      return res.status(404).json({ message: 'Skills progress not found' });
    }

    const skill = skillsContent.skills.find(s => s.name === skillName);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.logs.push({ text });
    await skillsContent.save();
    res.status(200).json(skillsContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSkills, updateSkills, addSkill, addLog };
