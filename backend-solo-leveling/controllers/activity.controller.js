const Activity = require('../models/activity.model');

const getActivity = async (req, res) => {
  try {
    const activityContent = await Activity.findOne({ userId: req.userId });
    if (!activityContent) {
      return res.status(200).json({ activities: [] });
    }
    res.status(200).json({ activities: activityContent.activities });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logActivity = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    let activityContent = await Activity.findOne({ userId: req.userId });
    
    if (!activityContent) {
      activityContent = new Activity({
        userId: req.userId,
        activities: [{ date: today, count: 1 }]
      });
      await activityContent.save();
      return res.status(200).json({ activities: activityContent.activities });
    }

    const todayActivity = activityContent.activities.find(a => a.date === today);
    if (todayActivity) {
      todayActivity.count += 1;
    } else {
      activityContent.activities.push({ date: today, count: 1 });
    }

    await activityContent.save();
    res.status(200).json({ activities: activityContent.activities });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getActivity, logActivity };
