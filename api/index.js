const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper function
const getCurrentDate = () => new Date().toISOString().split('T')[0];

app.use(cors());
app.use(express.json());

app.post('/api/increment', async (req, res) => {
  const currentDate = getCurrentDate();
  
  try {
    const { data: existing, error: selectError } = await supabase
      .from('user_counts')
      .select('count')
      .eq('date', currentDate)
      .single();

    if (existing) {
      const { data: updated, error: updateError } = await supabase
        .from('user_counts')
        .update({ count: existing.count + 1 })
        .eq('date', currentDate)
        .single();
      return res.json({ date: currentDate, count: updated.count });
    }

    const { data: newEntry, error: insertError } = await supabase
      .from('user_counts')
      .insert([{ date: currentDate, count: 1 }])
      .single();

    return res.json({ date: currentDate, count: newEntry.count });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Database operation failed' });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const { data: logs, error } = await supabase
      .from('user_counts')
      .select('date,count')
      .order('date', { ascending: false });

    res.json(logs || []);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

module.exports = app;