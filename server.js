const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

// Helper to get current date in YYYY-MM-DD format
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Increment endpoint
app.post('/increment', async (req, res) => {
  const currentDate = getCurrentDate();
  
  try {
    // Check for existing entry
    const { data: existing, error: selectError } = await supabase
      .from('user_counts')
      .select('count')
      .eq('date', currentDate)
      .single();

    if (existing) {
      // Update existing count
      const { data: updated, error: updateError } = await supabase
        .from('user_counts')
        .update({ count: existing.count + 1 })
        .eq('date', currentDate)
        .single();

      return res.json({ date: currentDate, count: updated.count });
    }

    // Create new entry
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

// Get logs endpoint
app.get('/logs', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});