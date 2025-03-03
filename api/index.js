const express = require('express');
const cors = require('cors');
const app = express();

// Vercel-friendly in-memory storage (replace with database for production)
let userCount = 0;
let currentDate = new Date().toISOString().split('T')[0];

// Middleware
app.use(cors());
app.use(express.json());

// Daily reset check (Vercel-friendly version)
function checkDateReset() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== currentDate) {
    currentDate = today;
    userCount = 0;
    console.log(`Date changed to ${currentDate}, reset count to 0`);
  }
}

// Routes
app.post('/api/increment', (req, res) => {
  checkDateReset();
  userCount++;
  res.json({ date: currentDate, count: userCount });
});

app.get('/api/logs', (req, res) => {
  checkDateReset();
  // For demo purposes, returns current day's count only
  res.json([{ 
    date: currentDate, 
    count: userCount 
  }]);
});

// Vercel requires module.exports for serverless functions
module.exports = app;