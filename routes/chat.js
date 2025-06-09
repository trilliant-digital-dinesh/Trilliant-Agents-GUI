const express = require('express');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');
const { generateAIResponse } = require('../services/aiService');

const router = express.Router();

// Get all conversations for user
router.get('/conversations', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, tags, search } = req.query;
    
    const query = { userId: req.userId, isArchived: false };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'messages.content': { $regex: search, $options: 'i' } }
      ];
    }

    const conversations = await Conversation.find(query)
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title lastActivity category tags isFavorite summary')
      .exec();

    const total = await Conversation.countDocuments(query);

    res.json({
      conversations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get specific conversation
router.get('/conversations/:id', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Create new conversation
router.post('/conversations', auth, async (req, res) => {
  try {
    const { title, category = 'general', tags = [] } = req.body;

    const conversation = new Conversation({
      userId: req.userId,
      title: title || 'New Conversation',
      category,
      tags,
      messages: []
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send message to conversation
router.post('/conversations/:id/messages', auth, async (req, res) => {
  try {
    const { content, attachments = [] } = req.body;
    
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
      metadata: { attachments }
    };

    conversation.messages.push(userMessage);

    // Generate AI response
    const startTime = Date.now();
    const aiResponse = await generateAIResponse(conversation.messages);
    const processingTime = Date.now() - startTime;

    // Add AI message
    const aiMessage = {
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        model: aiResponse.model,
        tokens: aiResponse.tokens,
        processingTime
      }
    };

    conversation.messages.push(aiMessage);
    conversation.lastActivity = new Date();

    await conversation.save();

    res.json({
      userMessage,
      aiMessage,
      conversationId: conversation._id
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Update conversation
router.patch('/conversations/:id', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['title', 'category', 'tags', 'isFavorite', 'isArchived'];
    const actualUpdates = {};

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        actualUpdates[key] = updates[key];
      }
    });

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      actualUpdates,
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Update conversation error:', error);
    res.status(500).json({ error: 'Failed to update conversation' });
  }
});

// Delete conversation
router.delete('/conversations/:id', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

// Export conversation
router.get('/conversations/:id/export', auth, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (format === 'markdown') {
      let markdown = `# ${conversation.title}\n\n`;
      markdown += `**Created:** ${conversation.createdAt.toLocaleDateString()}\n`;
      markdown += `**Category:** ${conversation.category}\n`;
      if (conversation.tags.length > 0) {
        markdown += `**Tags:** ${conversation.tags.join(', ')}\n`;
      }
      markdown += '\n---\n\n';

      conversation.messages.forEach(message => {
        const role = message.role === 'user' ? 'You' : 'Assistant';
        markdown += `## ${role}\n\n${message.content}\n\n`;
      });

      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${conversation.title}.md"`);
      res.send(markdown);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${conversation.title}.json"`);
      res.json(conversation);
    }
  } catch (error) {
    console.error('Export conversation error:', error);
    res.status(500).json({ error: 'Failed to export conversation' });
  }
});

module.exports = router;