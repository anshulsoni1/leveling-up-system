const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const healthRoute = require('./routes/health.route');
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const booksRoutes = require('./routes/books.route');
const dsaRoutes = require('./routes/dsa.route');
const skillsRoutes = require('./routes/skills.route');
const journalRoutes = require('./routes/journal.route');
const activityRoutes = require('./routes/activity.route');
const achievementRoutes = require('./routes/achievement.route');
const moduleRoutes = require('./routes/module.routes');
const moduleLogRoutes = require('./routes/moduleLog.routes');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

app.get('/test', (req, res) => {
  res.send("Backend running on Render");
});

app.use('/api/health', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/module-logs', moduleLogRoutes);

console.log("\n--- Registered Routes ---");
const routes = [
  'GET /test',
  'USE /api/health',
  'USE /api/auth',
  'USE /api/user',
  'USE /api/books',
  'USE /api/dsa',
  'USE /api/skills',
  'USE /api/journal',
  'USE /api/activity',
  'USE /api/achievements',
  'USE /api/modules',
  'GET /api/modules/test',
  'USE /api/module-logs'
];
routes.forEach(r => console.log('[ROUTE] ' + r));
console.log("-------------------------\n");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});