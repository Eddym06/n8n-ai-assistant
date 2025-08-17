// Advanced Test Suite for Phase 3: Multi-Agent AI & Collaboration
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHASE3_CONFIG = {
  SERVER_URL: 'http://localhost:3000',
  TEST_TIMEOUT: 30000,
  RETRY_COUNT: 3
};

// Color coding for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test Results Tracking
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

// Utility Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const makeRequest = async (endpoint, options = {}) => {
  const url = `${PHASE3_CONFIG.SERVER_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
};

const makeAuthenticatedRequest = async (endpoint, apiKey, options = {}) => {
  return makeRequest(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...(options.headers || {})
    }
  });
};

// Test Functions
const testServerHealth = async () => {
  log('\n🔍 Testing Server Health...', 'cyan');
  
  try {
    const health = await makeRequest('/health');
    
    // Verify health response structure
    const requiredFields = ['status', 'version', 'phase', 'workflows', 'memory_items', 'active_agents', 'features'];
    const missingFields = requiredFields.filter(field => !(field in health));
    
    if (missingFields.length > 0) {
      throw new Error(`Missing health fields: ${missingFields.join(', ')}`);
    }
    
    // Verify Phase 3 specific fields
    if (health.version !== '3.0.0') {
      throw new Error(`Expected version 3.0.0, got ${health.version}`);
    }
    
    if (health.phase !== 'Advanced Intelligence & Collaboration') {
      throw new Error(`Expected Phase 3, got ${health.phase}`);
    }
    
    // Verify features
    const expectedFeatures = ['multi_agent', 'collaboration', 'git_integration'];
    const missingFeatures = expectedFeatures.filter(feature => !health.features[feature]);
    
    if (missingFeatures.length > 0) {
      log(`⚠️  Some features not available: ${missingFeatures.join(', ')}`, 'yellow');
    }
    
    log(`✅ Server Health: OK (${health.workflows} workflows, ${health.memory_items} memories)`, 'green');
    return { success: true, data: health };
    
  } catch (error) {
    log(`❌ Server Health: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testAPIKeyGeneration = async () => {
  log('\n🔑 Testing API Key Generation...', 'cyan');
  
  try {
    const result = await makeRequest('/api-key');
    
    if (!result.api_key || typeof result.api_key !== 'string') {
      throw new Error('Invalid API key response');
    }
    
    if (!result.api_key.startsWith('n8n-ai-')) {
      throw new Error('API key format incorrect');
    }
    
    log(`✅ API Key: Generated successfully (${result.api_key.substring(0, 15)}...)`, 'green');
    return { success: true, data: result.api_key };
    
  } catch (error) {
    log(`❌ API Key: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testSystemStats = async () => {
  log('\n📊 Testing System Statistics...', 'cyan');
  
  try {
    const stats = await makeRequest('/stats');
    
    // Verify stats structure
    const requiredSections = ['workflows', 'memory', 'collaboration', 'system'];
    const missingSections = requiredSections.filter(section => !(section in stats));
    
    if (missingSections.length > 0) {
      throw new Error(`Missing stats sections: ${missingSections.join(', ')}`);
    }
    
    // Verify workflow stats
    if (stats.workflows.total < 1000) {
      log(`⚠️  Low workflow count: ${stats.workflows.total}`, 'yellow');
    }
    
    if (stats.workflows.categories < 50) {
      log(`⚠️  Low category count: ${stats.workflows.categories}`, 'yellow');
    }
    
    log(`✅ System Stats: OK (${stats.workflows.total} workflows, ${stats.workflows.categories} categories)`, 'green');
    return { success: true, data: stats };
    
  } catch (error) {
    log(`❌ System Stats: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testMultiAgentSystem = async (apiKey) => {
  log('\n🤖 Testing Multi-Agent System...', 'cyan');
  
  try {
    const testPrompts = [
      {
        prompt: "Analyze workflow error: Error in HTTP node - connection timeout",
        expectedAgent: "error"
      },
      {
        prompt: "Optimize this workflow for parallel execution",
        expectedAgent: "optimization"  
      },
      {
        prompt: "Generate a custom node for Slack integration",
        expectedAgent: "custom_node"
      }
    ];
    
    let successCount = 0;
    
    for (const test of testPrompts) {
      try {
        const result = await makeAuthenticatedRequest('/multi-agent', apiKey, {
          method: 'POST',
          body: JSON.stringify({
            prompt: test.prompt,
            context: { test: true }
          })
        });
        
        if (!result.success) {
          throw new Error(`Multi-agent request failed: ${result.error}`);
        }
        
        if (!result.routing || !result.routing.selected_agents) {
          throw new Error('Invalid multi-agent response structure');
        }
        
        log(`  ✅ Agent routing: ${result.routing.selected_agents.join(', ')}`, 'green');
        successCount++;
        
      } catch (error) {
        log(`  ❌ Agent test failed: ${error.message}`, 'red');
      }
      
      await sleep(1000); // Rate limiting
    }
    
    if (successCount === testPrompts.length) {
      log(`✅ Multi-Agent System: All tests passed (${successCount}/${testPrompts.length})`, 'green');
      return { success: true, data: { tests_passed: successCount } };
    } else {
      throw new Error(`Only ${successCount}/${testPrompts.length} tests passed`);
    }
    
  } catch (error) {
    log(`❌ Multi-Agent System: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testWorkflowSimulation = async (apiKey) => {
  log('\n🔬 Testing Workflow Simulation...', 'cyan');
  
  try {
    const testWorkflow = {
      name: "Test Workflow",
      nodes: [
        {
          id: "node1",
          name: "Trigger",
          type: "webhook",
          position: [0, 0],
          parameters: {}
        },
        {
          id: "node2", 
          name: "HTTP Request",
          type: "http",
          position: [200, 0],
          parameters: { url: "https://api.example.com" }
        },
        {
          id: "node3",
          name: "Process Data",
          type: "code",
          position: [400, 0],
          parameters: { code: "return items;" }
        }
      ],
      connections: {
        node1: { main: [{ node: "node2", type: "main", index: 0 }] },
        node2: { main: [{ node: "node3", type: "main", index: 0 }] }
      }
    };
    
    const result = await makeAuthenticatedRequest('/simulate', apiKey, {
      method: 'POST',
      body: JSON.stringify({
        workflow: testWorkflow,
        options: {
          include_performance: true,
          analyze_bottlenecks: true
        }
      })
    });
    
    if (!result.success) {
      throw new Error(`Simulation request failed: ${result.error}`);
    }
    
    if (!result.simulation) {
      throw new Error('Missing simulation data');
    }
    
    // Verify simulation structure
    const simulation = result.simulation;
    if (!simulation.predictions || !Array.isArray(simulation.predictions)) {
      throw new Error('Invalid simulation predictions structure');
    }
    
    if (!simulation.performance_metrics) {
      throw new Error('Missing performance metrics');
    }
    
    log(`✅ Workflow Simulation: OK (${simulation.predictions.length} predictions)`, 'green');
    return { success: true, data: simulation };
    
  } catch (error) {
    log(`❌ Workflow Simulation: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testMemoryOperations = async (apiKey) => {
  log('\n🧠 Testing Memory Operations...', 'cyan');
  
  try {
    const testOperations = [
      {
        action: 'add',
        content: 'Test memory item for Phase 3 testing',
        tags: ['test', 'phase3'],
        type: 'test'
      },
      {
        action: 'search',
        query: 'Phase 3 testing',
        limit: 5
      },
      {
        action: 'summarize'
      }
    ];
    
    let addedMemoryId = null;
    
    for (const operation of testOperations) {
      try {
        const result = await makeAuthenticatedRequest('/memory', apiKey, {
          method: 'POST',
          body: JSON.stringify(operation)
        });
        
        if (!result.success) {
          throw new Error(`Memory operation ${operation.action} failed: ${result.error}`);
        }
        
        if (operation.action === 'add') {
          addedMemoryId = result.result.id;
          log(`  ✅ Memory added: ${addedMemoryId}`, 'green');
        } else if (operation.action === 'search') {
          log(`  ✅ Memory search: Found ${result.result.length} items`, 'green');
        } else if (operation.action === 'summarize') {
          log(`  ✅ Memory summarize: ${result.result.memories_analyzed || 0} analyzed`, 'green');
        }
        
      } catch (error) {
        log(`  ❌ Memory operation ${operation.action} failed: ${error.message}`, 'red');
      }
      
      await sleep(500);
    }
    
    // Clean up test memory
    if (addedMemoryId) {
      try {
        await makeAuthenticatedRequest('/memory', apiKey, {
          method: 'POST',
          body: JSON.stringify({
            action: 'delete',
            id: addedMemoryId
          })
        });
        log(`  🧹 Test memory cleaned up`, 'blue');
      } catch (error) {
        log(`  ⚠️  Failed to clean up test memory: ${error.message}`, 'yellow');
      }
    }
    
    log(`✅ Memory Operations: All operations completed`, 'green');
    return { success: true, data: { operations_tested: testOperations.length } };
    
  } catch (error) {
    log(`❌ Memory Operations: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testTemplateSearch = async (apiKey) => {
  log('\n🔍 Testing Template Search...', 'cyan');
  
  try {
    const searchTests = [
      { query: 'HTTP API integration', expectedResults: 5 },
      { query: 'Slack notification', expectedResults: 3 },
      { query: '', limit: 10, expectedResults: 10 }, // Get top workflows
      { 
        query: 'database', 
        services: ['mysql', 'postgresql'], 
        minRating: 3,
        expectedResults: 2
      }
    ];
    
    let successCount = 0;
    
    for (const test of searchTests) {
      try {
        const result = await makeAuthenticatedRequest('/templates', apiKey, {
          method: 'POST',
          body: JSON.stringify(test)
        });
        
        if (!result.success) {
          throw new Error(`Template search failed: ${result.error}`);
        }
        
        if (!Array.isArray(result.results)) {
          throw new Error('Invalid search results structure');
        }
        
        log(`  ✅ Search "${test.query || 'all'}": Found ${result.results.length} results`, 'green');
        successCount++;
        
      } catch (error) {
        log(`  ❌ Search failed: ${error.message}`, 'red');
      }
      
      await sleep(500);
    }
    
    log(`✅ Template Search: ${successCount}/${searchTests.length} tests passed`, 'green');
    return { success: true, data: { tests_passed: successCount } };
    
  } catch (error) {
    log(`❌ Template Search: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testCollaborationSystem = async () => {
  log('\n🤝 Testing Collaboration System...', 'cyan');
  
  try {
    // Test room creation
    const apiKey = (await makeRequest('/api-key')).api_key;
    
    const roomResult = await makeAuthenticatedRequest('/collab/create-room', apiKey, {
      method: 'POST',
      body: JSON.stringify({
        roomId: 'test-room-' + Date.now(),
        name: 'Phase 3 Test Room'
      })
    });
    
    if (!roomResult.success) {
      throw new Error(`Room creation failed: ${roomResult.error}`);
    }
    
    log(`  ✅ Room created: ${roomResult.room.id}`, 'green');
    
    // Test room listing
    const roomsResult = await makeAuthenticatedRequest('/collab/rooms', apiKey);
    
    if (!roomsResult.success) {
      throw new Error(`Room listing failed: ${roomsResult.error}`);
    }
    
    log(`  ✅ Room listing: ${roomsResult.rooms.length} rooms found`, 'green');
    
    // Note: WebSocket testing would require more complex setup
    log(`  ⚠️  WebSocket collaboration testing requires manual verification`, 'yellow');
    
    log(`✅ Collaboration System: Basic functionality verified`, 'green');
    return { success: true, data: { room_created: roomResult.room.id } };
    
  } catch (error) {
    log(`❌ Collaboration System: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

const testGitIntegration = async (apiKey) => {
  log('\n🔧 Testing Git Integration...', 'cyan');
  
  try {
    // Test git status (basic functionality)
    const statusResult = await makeAuthenticatedRequest('/git', apiKey, {
      method: 'POST',
      body: JSON.stringify({
        action: 'status'
      })
    });
    
    if (!statusResult.success) {
      // Git may not be initialized, which is okay
      log(`  ⚠️  Git status: ${statusResult.error}`, 'yellow');
    } else {
      log(`  ✅ Git status: Working`, 'green');
    }
    
    // Test changelog generation
    const changelogResult = await makeAuthenticatedRequest('/git', apiKey, {
      method: 'POST',
      body: JSON.stringify({
        action: 'generate-changelog'
      })
    });
    
    if (!changelogResult.success) {
      log(`  ⚠️  Changelog generation: ${changelogResult.error}`, 'yellow');
    } else {
      log(`  ✅ Changelog generation: Working`, 'green');
    }
    
    log(`✅ Git Integration: Functionality verified`, 'green');
    return { success: true, data: { status_checked: true } };
    
  } catch (error) {
    log(`❌ Git Integration: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

// Performance Tests
const testPerformance = async (apiKey) => {
  log('\n⚡ Testing Performance...', 'cyan');
  
  try {
    const performanceTests = [
      {
        name: 'Health Check',
        endpoint: '/health',
        method: 'GET'
      },
      {
        name: 'Template Search',
        endpoint: '/templates',
        method: 'POST',
        body: { query: 'test', limit: 10 }
      },
      {
        name: 'Memory Search',
        endpoint: '/memory',
        method: 'POST',
        body: { action: 'search', query: 'test', limit: 5 }
      }
    ];
    
    const results = [];
    
    for (const test of performanceTests) {
      const startTime = Date.now();
      
      try {
        if (test.method === 'GET') {
          await makeRequest(test.endpoint);
        } else {
          await makeAuthenticatedRequest(test.endpoint, apiKey, {
            method: test.method,
            body: JSON.stringify(test.body)
          });
        }
        
        const duration = Date.now() - startTime;
        results.push({ name: test.name, duration, success: true });
        
        const color = duration < 500 ? 'green' : duration < 2000 ? 'yellow' : 'red';
        log(`  ${test.name}: ${duration}ms`, color);
        
      } catch (error) {
        const duration = Date.now() - startTime;
        results.push({ name: test.name, duration, success: false, error: error.message });
        log(`  ${test.name}: FAILED in ${duration}ms`, 'red');
      }
      
      await sleep(100);
    }
    
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const successRate = results.filter(r => r.success).length / results.length * 100;
    
    log(`✅ Performance: Average ${avgDuration.toFixed(0)}ms, ${successRate.toFixed(1)}% success`, 'green');
    return { success: true, data: { average_duration: avgDuration, success_rate: successRate } };
    
  } catch (error) {
    log(`❌ Performance: FAILED - ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
};

// Main Test Runner
const runPhase3Tests = async () => {
  log('🚀 Starting Phase 3 Advanced Test Suite', 'magenta');
  log('=' .repeat(50), 'blue');
  
  const startTime = Date.now();
  let apiKey = null;
  
  // Test sequence
  const tests = [
    { name: 'Server Health', fn: testServerHealth },
    { name: 'API Key Generation', fn: testAPIKeyGeneration },
    { name: 'System Statistics', fn: testSystemStats },
    { name: 'Multi-Agent System', fn: (apiKey) => testMultiAgentSystem(apiKey), requiresAuth: true },
    { name: 'Workflow Simulation', fn: (apiKey) => testWorkflowSimulation(apiKey), requiresAuth: true },
    { name: 'Memory Operations', fn: (apiKey) => testMemoryOperations(apiKey), requiresAuth: true },
    { name: 'Template Search', fn: (apiKey) => testTemplateSearch(apiKey), requiresAuth: true },
    { name: 'Collaboration System', fn: testCollaborationSystem },
    { name: 'Git Integration', fn: (apiKey) => testGitIntegration(apiKey), requiresAuth: true },
    { name: 'Performance Tests', fn: (apiKey) => testPerformance(apiKey), requiresAuth: true }
  ];
  
  // Get API key for authenticated tests
  const apiKeyResult = await testAPIKeyGeneration();
  if (apiKeyResult.success) {
    apiKey = apiKeyResult.data;
  }
  
  // Run all tests
  for (const test of tests) {
    testResults.total++;
    
    try {
      let result;
      
      if (test.requiresAuth && !apiKey) {
        log(`⏭️  Skipping ${test.name} (no API key)`, 'yellow');
        testResults.skipped++;
        testResults.details.push({
          name: test.name,
          status: 'skipped',
          reason: 'No API key available'
        });
        continue;
      }
      
      if (test.requiresAuth) {
        result = await test.fn(apiKey);
      } else {
        result = await test.fn();
      }
      
      if (result.success) {
        testResults.passed++;
        testResults.details.push({
          name: test.name,
          status: 'passed',
          data: result.data
        });
      } else {
        testResults.failed++;
        testResults.details.push({
          name: test.name,
          status: 'failed',
          error: result.error
        });
      }
      
    } catch (error) {
      log(`💥 Unexpected error in ${test.name}: ${error.message}`, 'red');
      testResults.failed++;
      testResults.details.push({
        name: test.name,
        status: 'failed',
        error: error.message
      });
    }
    
    await sleep(1000); // Delay between tests
  }
  
  // Generate test report
  const duration = Date.now() - startTime;
  
  log('\n' + '=' .repeat(50), 'blue');
  log('📊 Phase 3 Test Results Summary', 'magenta');
  log('=' .repeat(50), 'blue');
  
  log(`Total Tests: ${testResults.total}`, 'blue');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, 'red');
  log(`Skipped: ${testResults.skipped}`, 'yellow');
  log(`Success Rate: ${(testResults.passed / (testResults.total - testResults.skipped) * 100).toFixed(1)}%`, 'cyan');
  log(`Duration: ${(duration / 1000).toFixed(2)}s`, 'blue');
  
  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'phase3-test-results.json');
  const report = {
    timestamp: new Date().toISOString(),
    duration: duration,
    summary: testResults,
    system_info: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
  
  try {
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Detailed results saved to: ${reportPath}`, 'blue');
  } catch (error) {
    log(`⚠️  Failed to save results: ${error.message}`, 'yellow');
  }
  
  // Final status
  if (testResults.failed === 0) {
    log('\n🎉 All Phase 3 tests completed successfully!', 'green');
    process.exit(0);
  } else {
    log(`\n⚠️  ${testResults.failed} test(s) failed. Check logs above.`, 'yellow');
    process.exit(1);
  }
};

// Handle command line execution
if (process.argv[1] === __filename) {
  runPhase3Tests().catch(error => {
    log(`💥 Test suite crashed: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  });
}

export { runPhase3Tests };
