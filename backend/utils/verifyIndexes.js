// utils/verifyIndexes.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Session = require('../models/Session');

const verifyIndexes = async () => {
    console.log('\n=== Index Verification ===');
    
    const collections = [
        { name: 'Users', model: User },
        { name: 'Tasks', model: Task },
        { name: 'Sessions', model: Session }
    ];

    for (const { name, model } of collections) {
        console.log(`\n${name} Collection:`);
        
        const indexes = await model.collection.getIndexes();
        console.log('Current indexes:', indexes);

        // Test each index
        for (const [indexName, indexDef] of Object.entries(indexes)) {
            if (indexName === '_id_') continue;

            const fields = {};
            indexDef.forEach(([field]) => {
                fields[field] = 1;
            });

            console.time(`${indexName} lookup`);
            const result = await model.findOne(fields).explain('executionStats');
            console.timeEnd(`${indexName} lookup`);
            
            console.log(`Index ${indexName}:`, {
                used: result.queryPlanner.winningPlan.inputStage?.indexName === indexName,
                docsExamined: result.executionStats.totalDocsExamined,
                time: result.executionStats.executionTimeMillis
            });
        }
    }
};

module.exports = verifyIndexes;