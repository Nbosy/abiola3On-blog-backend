const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

// Initialize Supabase client with service role key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Middleware to parse JSON request bodies
app.use(express.json());

// Example route to get all users (Admin API)
app.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/delete-user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
      const { data, error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      res.status(200).json({ message: 'User deleted successfully', data });
  } catch (error) {
      console.error('Error deleting user:', error.message);
      res.status(500).json({ error: 'Failed to delete user' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
