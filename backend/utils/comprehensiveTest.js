// backend/utils/comprehensiveTest.js
const User = require('../models/User');
const Task = require('../models/Task');
const mongoose = require('mongoose');

const comprehensiveTest = async () => {
    console.log('\n=== Comprehensive Performance Test ===');

    try {
        // Get a test user
        const testUser = await User.findOne();
        
        if (!testUser) {
            console.log('No users found in database for testing');
            return;
        }

        // Read Operations
        console.log('\nRead Operations:');
        
        // Test indexed query
        console.time('Indexed query - Find by email');
        await User.findOne({ email: testUser.email }).explain('executionStats')
            .then(stats => console.log(
                `Index used: ${stats.queryPlanner.winningPlan.inputStage?.indexName || 'None'}, ` +
                `Docs examined: ${stats.executionStats.totalDocsExamined}`
            ));
        console.timeEnd('Indexed query - Find by email');

        // Test non-indexed query
        console.time('Non-indexed query - Find by creation date');
        await User.findOne({ createdAt: testUser.createdAt }).explain('executionStats')
            .then(stats => console.log(
                `Index used: ${stats.queryPlanner.winningPlan.inputStage?.indexName || 'None'}, ` +
                `Docs examined: ${stats.executionStats.totalDocsExamined}`
            ));
        console.timeEnd('Non-indexed query - Find by creation date');

        // Write Operations
        console.log('\nWrite Operations:');
        
        // Test task creation
        console.time('Create task');
        const newTask = await Task.create({
            title: 'Performance Test Task',
            description: 'Testing write performance',
            user: testUser._id
        });
        console.timeEnd('Create task');

        // Test task update
        console.time('Update task');
        await Task.updateOne(
            { _id: newTask._id },
            { $set: { completed: true } }
        );
        console.timeEnd('Update task');

        // Test task deletion
        console.time('Delete task');
        await Task.deleteOne({ _id: newTask._id });
        console.timeEnd('Delete task');

        // Compound Index Test
        console.log('\nCompound Index Test:');
        console.time('Find tasks with compound conditions');
        await Task.find({
            user: testUser._id,
            completed: false
        }).sort({ createdAt: -1 }).explain('executionStats')
            .then(stats => console.log(
                `Index used: ${stats.queryPlanner.winningPlan.inputStage?.indexName || 'None'}, ` +
                `Docs examined: ${stats.executionStats.totalDocsExamined}`
            ));
        console.timeEnd('Find tasks with compound conditions');

    } catch (error) {
        console.error('Comprehensive test error:', error);
    }
};

module.exports = comprehensiveTest;