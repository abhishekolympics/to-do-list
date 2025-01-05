// backend/utils/advancedPerformanceTest.js
const User = require("../models/User");
const Task = require("../models/Task");
const Session = require("../models/Session");

const advancedPerformanceTest = async () => {
  console.log("\n=== Advanced Performance Metrics ===");

  try {
    const testUser = await User.findOne();
    if (!testUser) return;

    // 1. Authentication Performance
    console.log("\nAuthentication Operations:");
    console.time("Session lookup");
    await Session.findOne({ userId: testUser._id })
      .explain("executionStats")
      .then((stats) =>
        console.log(
          `Session lookup - Index used: ${
            stats.queryPlanner.winningPlan.inputStage?.indexName || "None"
          }, ` + `Time: ${stats.executionStats.executionTimeMillis}ms`
        )
      );
    console.timeEnd("Session lookup");

    // utils/advancedPerformanceTest.js
    // Fix the aggregate pipeline test
    console.log("\nAggregate Operations:");
    console.time("Task statistics");
    const taskStats = await Task.aggregate([
      { $match: { user: testUser._id } },
      {
        $group: {
          _id: "$completed",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("Task statistics results:", taskStats);
    console.timeEnd("Task statistics");

    // 3. Index Coverage Analysis
    console.log("\nIndex Coverage:");
    const userIndexes = await User.collection.getIndexes();
    const taskIndexes = await Task.collection.getIndexes();

    console.log("User Indexes:", Object.keys(userIndexes).length);
    console.log("Task Indexes:", Object.keys(taskIndexes).length);

    // 4. Memory Usage
    const stats = await User.db.db.stats();
    console.log("\nDatabase Statistics:");
    console.log({
      dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
      indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
      avgObjSize: `${stats.avgObjSize} bytes`,
    });

    // 5. Batch Operation Performance
    console.log("\nBatch Operations:");
    console.time("Batch task creation");
    const batchTasks = await Task.insertMany([
      { title: "Test 1", user: testUser._id },
      { title: "Test 2", user: testUser._id },
      { title: "Test 3", user: testUser._id },
    ]);
    console.timeEnd("Batch task creation");

    // Cleanup batch tasks
    await Task.deleteMany({ _id: { $in: batchTasks.map((t) => t._id) } });
  } catch (error) {
    console.error("Advanced test error:", error);
  }
};

module.exports = advancedPerformanceTest;
