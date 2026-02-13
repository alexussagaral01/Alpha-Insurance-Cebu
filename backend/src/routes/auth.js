import express from 'express';
import supabase from '../config/database.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    console.log('Login attempt:', { username, password });
    
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('admin_id, username, password')
      .eq('username', username)
      .single();

    console.log('Query result:', { data, error });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data && data.password === password) {
      res.json({ success: true, message: 'Login successful', adminId: data.admin_id, username: data.username });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
