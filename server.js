const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  try {
    await client.connect();
    db = client.db('gardengame');
    console.log('✅ Connected to MongoDB Atlas');
    await db.collection('userCounts').createIndex({ date: 1 }, { unique: true });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

connectDB();

// Daily count management
app.post('/increment', async (req, res) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    const collection = db.collection('userCounts');
    
    const result = await collection.findOneAndUpdate(
      { date },
      { $inc: { count: 1 } },
      { 
        upsert: true,
        returnDocument: 'after',
        projection: { _id: 0, date: 1, count: 1 }
      }
    );

    res.json(result.value);
  } catch (error) {
    console.error('Error updating count:', error);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// Get logs endpoint
app.get('/logs', async (req, res) => {
  try {
    const collection = db.collection('userCounts');
    const logs = await collection.find(
      {},
      { projection: { _id: 0, date: 1, count: 1 } }
    ).sort({ date: 1 }).toArray();
    
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gardencraft-dashboard.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});