// backend/utils/monitorIndexes.js
const User = require('../models/User');
const Task = require('../models/Task');
const Session = require('../models/Session');
const IpAddress = require('../models/IpAddress');

const monitorIndexes = async () => {
  try {
    const models = [User, Task, Session, IpAddress];
    
    for (const Model of models) {
      console.log(`\nChecking indexes for ${Model.modelName}:`);
      
      try {
        // Get all indexes
        const indexes = await Model.collection.getIndexes();
        console.log('Current indexes:', indexes);
        
        // Get collection stats using db.command
        const stats = await Model.db.db.command({
          collStats: Model.collection.collectionName
        });
        
        console.log('Collection stats:', {
          size: stats.size,
          totalIndexSize: stats.totalIndexSize,
          indexSizes: stats.indexSizes
        });

        // Log specific index details
        for (const [indexName, indexDetails] of Object.entries(indexes)) {
          console.log(`\nIndex: ${indexName}`);
          console.log('Fields:', indexDetails);
          console.log('Size:', stats.indexSizes[indexName], 'bytes');
        }
      } catch (error) {
        console.error(`Error getting stats for ${Model.modelName}:`, error);
      }
    }
  } catch (error) {
    console.error('Error monitoring indexes:', error);
  }
};

module.exports = monitorIndexes;