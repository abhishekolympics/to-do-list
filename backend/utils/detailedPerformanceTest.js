// backend/utils/detailedPerformanceTest.js
const User = require('../models/User');
const Task = require('../models/Task');

const detailedPerformanceTest = async () => {
    console.log('\n=== Detailed Query Analysis ===');

    // Test email lookup performance
    const emailQueryStats = await User.findOne({ email: 'test@example.com' })
        .explain('executionStats');
    
    console.log('\nEmail Lookup Performance:');
    console.log({
        indexUsed: emailQueryStats.queryPlanner.winningPlan.inputStage?.indexName || 'No index',
        timeMillis: emailQueryStats.executionStats.executionTimeMillis,
        docsExamined: emailQueryStats.executionStats.totalDocsExamined,
        docsReturned: emailQueryStats.executionStats.nReturned
    });

    // Test task lookup performance
    const taskQueryStats = await Task.find({ user: '123' }) // replace with actual user ID
        .explain('executionStats');

    console.log('\nTask Lookup Performance:');
    console.log({
        indexUsed: taskQueryStats.queryPlanner.winningPlan.inputStage?.indexName || 'No index',
        timeMillis: taskQueryStats.executionStats.executionTimeMillis,
        docsExamined: taskQueryStats.executionStats.totalDocsExamined,
        docsReturned: taskQueryStats.executionStats.nReturned
    });
};

module.exports = detailedPerformanceTest;