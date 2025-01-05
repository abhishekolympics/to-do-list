const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.index({ user: 1, completed: 1 });  // For queries that filter by both user and completion status
taskSchema.index({ user: 1, createdAt: -1 });
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
