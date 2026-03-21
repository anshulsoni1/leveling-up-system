const Boss = require('../models/boss.model');


const dealDamageToBoss = async (userId, damageAmount) => {
  const boss = await Boss.findOne({ userId, active: true });
  
  if (!boss) {
    throw new Error('No active boss found');
  }

  boss.hp -= damageAmount;
  let defeated = false;

  if (boss.hp <= 0) {
    boss.hp = 0;
    boss.active = false;
    defeated = true;
  }

  await boss.save();

  return { hp: boss.hp, defeated };
};

const checkAndSpawnBoss = async (userId, inactiveDays) => {
  // Check if there's already an active boss for this user
  let existingBoss = await Boss.findOne({ userId, active: true });
  
  // Spawn constraint checks
  if (!existingBoss && inactiveDays >= 3) {
    existingBoss = new Boss({
      userId,
      name: 'Procrastination Demon',
      hp: 300,
      maxHp: 300,
      damagePerDay: 10,
      active: true,
      spawnDate: Date.now()
    });
    
    await existingBoss.save();
  }
  
  return existingBoss;
};

module.exports = {
  checkAndSpawnBoss,
  dealDamageToBoss
};
