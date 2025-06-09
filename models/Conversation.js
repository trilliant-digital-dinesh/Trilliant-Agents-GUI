const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    model: String,
    tokens: Number,
    processingTime: Number,
    attachments: [{
      type: String,
      name: String,
      size: Number,
      url: String
    }]
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  messages: [messageSchema],
  tags: [{
    type: String,
    trim: true
  }],
  isArchived: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['general', 'work', 'research', 'coding', 'creative', 'analysis'],
    default: 'general'
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
conversationSchema.index({ userId: 1, lastActivity: -1 });
conversationSchema.index({ userId: 1, tags: 1 });
conversationSchema.index({ userId: 1, category: 1 });

// Update lastActivity on message addition
conversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Generate title from first message if not provided
conversationSchema.pre('save', function(next) {
  if (!this.title && this.messages.length > 0) {
    const firstUserMessage = this.messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      this.title = firstUserMessage.content.substring(0, 50) + 
        (firstUserMessage.content.length > 50 ? '...' : '');
    }
  }
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);