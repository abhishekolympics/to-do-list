const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const rebuildIndexes = async () => {
  try {
    await User.collection.dropIndexes();
    await User.collection.createIndex({ email: 1 }, { background: true });
    await User.collection.createIndex({ username: 1 }, { background: true });
  } catch (error) {
    console.error('Index rebuild error:', error);
  }
};
const User = mongoose.model('User', userSchema);

module.exports = User;
