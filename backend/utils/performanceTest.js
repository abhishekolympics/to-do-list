const User = require('../models/User');
const Task = require('../models/Task');
const Session = require('../models/Session');
const IpAddress = require('../models/IpAddress');

// utils/performanceTest.js
const performanceTest = async () => {
    console.log('\n=== Performance Test Results ===');

    try {
        // Warm up the connection
        await User.findOne();
        
        const testUser = await User.findOne();
        if (!testUser) return;

        // Test with multiple iterations for accuracy
        for (let i = 0; i < 5; i++) {
            console.log(`\nIteration ${i + 1}:`);
            
            // Email lookup (should use index)
            const emailStart = process.hrtime();
            await User.findOne({ email: testUser.email });
            const emailTime = process.hrtime(emailStart);
            console.log(`Email lookup: ${emailTime[1] / 1000000}ms`);

            // Task lookup (should use compound index)
            const taskStart = process.hrtime();
            await Task.find({ 
                user: testUser._id,
                completed: false 
            }).sort({ createdAt: -1 });
            const taskTime = process.hrtime(taskStart);
            console.log(`Task lookup: ${taskTime[1] / 1000000}ms`);
        }

    } catch (error) {
        console.error('Performance test error:', error);
    }
};

module.exports = performanceTest;