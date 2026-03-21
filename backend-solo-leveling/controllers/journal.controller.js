const Journal = require('../models/journal.model');

const getJournal = async (req, res) => {
  try {
    const { module } = req.params;
    
    if (module) {
      const journal = await Journal.findOne({ userId: req.userId, module });
      if (!journal) {
        return res.status(200).json({ entries: [] });
      }
      return res.status(200).json({ entries: journal.entries });
    } else {
      const journals = await Journal.find({ userId: req.userId });
      let allEntries = [];
      journals.forEach(j => {
        allEntries = [...allEntries, ...j.entries];
      });
      
      return res.status(200).json({ entries: allEntries });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const addEntry = async (req, res) => {
  try {
    const { module } = req.params;
    const targetModule = module || 'general';
    const { text, content } = req.body;
    
    // Support either text or content parameter
    const entryText = text || content;
    
    if (!entryText) {
      return res.status(400).json({ message: 'Entry text is required' });
    }

    const journal = await Journal.findOneAndUpdate(
      { userId: req.userId, module: targetModule },
      { $push: { entries: { text: entryText } } },
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
