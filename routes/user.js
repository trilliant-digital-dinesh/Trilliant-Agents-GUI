const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['name', 'avatar', 'preferences'];
    const actualUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'preferences') {
          actualUpdates[key] = { ...updates[key] };
        } else {
          actualUpdates[key] = updates[key];
        }
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      actualUpdates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const Conversation = require('../models/Conversation');
    
    const stats = await Conversation.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: null,
          totalConversations: { $sum: 1 },
          totalMessages: { $sum: { $size: '$messages' } },
          favoriteConversations: {
            $sum: { $cond: ['$isFavorite', 1, 0] }
          },
          archivedConversations: {
            $sum: { $cond: ['$isArchived', 1, 0] }
          }
        }
      }
    ]);

    const categoryStats = await Conversation.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {
        totalConversations: 0,
        totalMessages: 0,
        favoriteConversations: 0,
        archivedConversations: 0
      },
      categories: categoryStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

module.exports = router;