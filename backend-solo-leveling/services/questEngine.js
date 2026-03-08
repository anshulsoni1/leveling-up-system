const Quest = require('../models/quest.model');
const Boss = require('../models/boss.model');

async function generateDailyQuests(userId, userStats) {
  // Check if quests already generated today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const existingQuests = await Quest.find({
    userId,
    createdAt: { $gte: startOfDay }
  });

  if (existingQuests.length > 0) {
    return existingQuests; // Already generated
  }

  const newQuests = [];
  const { inactiveDays, streak, moduleInactive } = userStats || { inactiveDays: 0, streak: 0, moduleInactive: false };

  // 1. Recovery Quest
  if (inactiveDays >= 3) {
    newQuests.push({
      userId,
      title: 'Recovery Routine',
      description: 'You have been inactive for 3+ days. Complete 1 module to break the stagnation.',
      rewardXP: 100,
      type: 'Recovery'
    });
  }

  // 2. Boss Quest
  const activeBoss = await Boss.findOne({ userId, active: true });
  if (activeBoss) {
    newQuests.push({
      userId,
      title: 'Defeat the Demon',
      description: `Deal damage to ${activeBoss.name} by completing modules today.`,
      rewardXP: 150,
      type: 'Boss'
    });
  }

  // 3. Streak Quest
  if (streak >= 7) {
    newQuests.push({
      userId,
      title: 'Maintain Momentum',
      description: 'You are on a 7+ day streak! Complete 3 modules today to keep the momentum going.',
      rewardXP: 200,
      type: 'Streak'
    });
  }

  // 4. Balance Quest
  if (moduleInactive) {
    newQuests.push({
      userId,
      title: 'Restore Balance',
      description: 'One of your modules has been neglected. Allocate time to it today.',
      rewardXP: 80,
      type: 'Balance'
    });
  }

  // 5. Default Daily if empty
  if (newQuests.length === 0) {
    newQuests.push({
      userId,
      title: 'Daily Training',
      description: 'Complete at least 1 module to maintain your Hunter rank.',
      rewardXP: 50,
      type: 'Daily'
    });
  }

  const createdQuests = await Quest.insertMany(newQuests);
  return createdQuests;
}

module.exports = {
  generateDailyQuests
};