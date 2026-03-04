const mongoose = require('mongoose');
const Achievement = require('../models/achievement.model');
const User = require('../models/user.model');
const Books = require('../models/books.model');
const DSA = require('../models/dsa.model');
const Skills = require('../models/skills.model');
const Activity = require('../models/activity.model');


const ACHIEVEMENTS = [
 {key:'BOOK_100', type:'books', target:100},
 {key:'DSA_50', type:'dsa', target:50},
 {key:'STREAK_7', type:'activity', target:7},
 {key:'LEVEL_5', type:'level', target:5},
 {key:'SKILL_1', type:'skills', target:1}
];

exports.getAchievements = async (req, res) => {
   try {
      let doc = await Achievement.findOne({ userId: req.user.id });
      if (!doc) doc = { achievements: [] };
      
      res.json({ achievements: doc.achievements });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
   }
};

exports.checkAchievements = async (req, res) => {
   try {
      const userId = req.user.id;
      
      // Fetch all core trackers to evaluate the rulebook payload map
      const user = await User.findById(userId);
      const books = await Books.findOne({ userId });
      const dsa = await DSA.findOne({ userId });
      const skills = await Skills.findOne({ userId });
      // For Activity streaking we need proper metrics tracking algorithm
      const activity = await Activity.findOne({ userId });
      
      // Retrieve current unlocks
      let masterDoc = await Achievement.findOne({ userId });
      if (!masterDoc) {
         masterDoc = new Achievement({ userId, achievements: [] });
      }
      
      let newUnlocks = false;
      
      const hasUnlocked = (key) => masterDoc.achievements.some(a => a.key === key);
      
      for (let def of ACHIEVEMENTS) {
         if (hasUnlocked(def.key)) continue;
         
         let isUnlocked = false;
         
         // Validate maps cleanly without spamming
         if (def.type === 'level' && user && user.level >= def.target) isUnlocked = true;
         
         if (def.type === 'books' && books) {
            let totalRead = 0;
            // Check safety if history acts weird
            if (books.history) { 
                if (books.history instanceof Map) {
                    for(let val of books.history.values()) totalRead += Number(val);
                } else {
                    Object.values(books.history).forEach(val => totalRead += Number(val)); 
                }
            }
            if (totalRead >= def.target) isUnlocked = true;
         }
         
         if (def.type === 'dsa' && dsa) {
            let solved = 0;
            dsa.categories.forEach(c => {
               c.topics.forEach(t => { if (t.solved) solved++; });
            });
            if (solved >= def.target) isUnlocked = true;
         }
         
         if (def.type === 'skills' && skills && skills.skills.length >= def.target) isUnlocked = true;
         
         if (def.type === 'activity' && activity) {
            // Simplifed mock check for the requirement -> assume unique logged dates
            let uniqueDays = new Set(activity.activities.map(a => a.split('T')[0])).size;
            if (uniqueDays >= def.target) isUnlocked = true;
         }
         
         if (isUnlocked) {
            masterDoc.achievements.push({ key: def.key });
            newUnlocks = true;
         }
      }
      
      if (newUnlocks) await masterDoc.save();
      
      res.json({ achievements: masterDoc.achievements, newUnlocks });
      
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error check bounds' });
   }
};