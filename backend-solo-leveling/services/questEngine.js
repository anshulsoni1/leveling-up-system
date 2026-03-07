const Quest = require('../models/quest.model');
const User = require('../models/user.model');

// Generate daily contextual quests based on frontend metrics
const generateDailyQuests = async (userId, params) => {
  const { inactiveDays = 0, streak = 0, bossActive = false } = params;

  // Clear existing uncompleted daily quests to regenerate fresh context
  await Quest.deleteMany({ userId, completed: false });

  const newQuests = [];

  // 1. Recovery Quest
  if (inactiveDays >= 3) {
    newQuests.push({
      userId,
      title: 'Arise from the Shadows',
      description: 'You have been inactive. Complete 1 module to break the inertia.',
      rewardXP: 50,
      type: 'RECOVERY'
    });
  }

  // 2. Streak Momentum Quest
  if (streak >= 7) {
    newQuests.push({
      userId,
      title: 'Relentless Momentum',
      description: `You are on a ${streak}-day streak! Complete 2 modules today to maintain the fire.`,
      rewardXP: 30,
      type: 'STREAK'
    });
  }

  // 3. Boss Active Quest
  if (bossActive === 'true' || bossActive === true) {
    newQuests.push({
      userId,
      title: 'Demon Slayer',
      description: 'A Demon is active. Deal damage and reduce its HP.',
      rewardXP: 100,
      type: 'BOSS'
    });
  }

  // 4. Default Routine (If no special conditions met, or just as a baseline)
  if (newQuests.length === 0) {
    newQuests.push({
      userId,
      title: 'Daily Routine',
      description: 'Log at least 1 activity in your modules today.',
      rewardXP: 20,
      type: 'DAILY'
    });
  }

  const savedQuests = await Quest.insertMany(newQuests);
  return savedQuests;
};

// Check Quest Completion & Award XP
const checkQuestCompletion = async (questId, userId) => {
  const quest = await Quest.findOne({ _id: questId, userId });
  
  if (!quest) {
    throw new Error('Quest not found');
  }
  
  if (quest.completed) {
    throw new Error('Quest already completed');
  }

  quest.completed = true;
  await quest.save();

  // Directly update user XP
  const user = await User.findById(userId);
  if (user) {
    user.xp += quest.rewardXP;
    user.level = Math.floor(user.xp / 100) + 1; // Basic leveling formula
    await user.save();
  }

  return { quest, xpRewarded: quest.rewardXP, newTotalXp: user ? user.xp : 0 };
};

module.exports = {
  generateDailyQuests,
  checkQuestCompletion
};
