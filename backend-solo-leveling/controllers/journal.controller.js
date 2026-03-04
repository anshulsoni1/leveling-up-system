const Journal = require('../models/journal.model');

const getJournal = async (req, res) => {
  try {
    const { module } = req.params;
    const journal = await Journal.findOne({ userId: req.userId, module });
    
    if (!journal) {
      return res.status(200).json({ entries: [] });
    }
    
    res.status(200).json({ entries: journal.entries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addEntry = async (req, res) => {
  try {
    const { module } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Entry text is required' });
    }

    const journal = await Journal.findOneAndUpdate(
      { userId: req.userId, module },
      { $push: { entries: { text } } },
      { new: true, upsert: true }
    );

    res.status(200).json({ entries: journal.entries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteEntry = async (req, res) => {
  try {
    const { module, entryId } = req.params;

    const journal = await Journal.findOneAndUpdate(
      { userId: req.userId, module },
      { $pull: { entries: { _id: entryId } } },
      { new: true }
    );

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    res.status(200).json({ entries: journal.entries });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getJournal, addEntry, deleteEntry };
