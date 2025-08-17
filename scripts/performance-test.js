/**
 * 🚀 Performance Test Script - Phase 4
 * Load testing and performance benchmarking
 */

import http from 'http';
import { performance } from 'perf_hooks';

class PerformanceTester {
  constructor() {
    this.serverUrl = 'http://localhost:3000';
    this.results = [];
  }

  async runAllTests() {
    console.log('🚀 Phase 4 Performance Testing Suite');
    console.log('=' .repeat(40));

    await this.testResponseTimes();
    await this.testConcurrentLoad();
    await this.testCachePerformance();
    await this.testMemoryUsage();
    
    this.generateReport();
  }

  async testResponseTimes() {
    console.log('\n⚡ Testing Response Times...');
    
    const endpoints = [
      '/health',
      '/api/analytics',
      '/cache/stats'
    ];

    for (const endpoint of endpoints) {
      const times = [];
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await this.makeRequest(endpoint);
        const end = performance.now();
        times.push(end - start);
      }
      
      const avgTime = Math.round(times.reduce((a, b) => a + b) / times.length);
      console.log(`  ${endpoint}: ${avgTime}ms avg`);
      
      this.results.push({
        test: 'response-time',
        endpoint,
        avgTime,
        times
      });
    }
  }

  async testConcurrentLoad() {
    console.log('\n🏋️ Testing Concurrent Load...');
    
    const concurrentRequests = 10;
    const requests = [];
    
    const start = performance.now();
    
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(this.makeRequest('/health'));
    }
    
    const responses = await Promise.allSettled(requests);
    const end = performance.now();
    
    const successful = responses.filter(r => r.status === 'fulfilled').length;
    const totalTime = Math.round(end - start);
    
    console.log(`  ${successful}/${concurrentRequests} requests successful`);
    console.log(`  Total time: ${totalTime}ms`);
    console.log(`  Requests/second: ${Math.round((successful / totalTime) * 1000)}`);
    
    this.results.push({
      test: 'concurrent-load',
      totalRequests: concurrentRequests,
      successful,
      totalTime,
      requestsPerSecond: Math.round((successful / totalTime) * 1000)
    });
  }

  async testCachePerformance() {
    console.log('\n💾 Testing Cache Performance...');
    
    const testData = {
      message: 'cache performance test',
      context: { nodes: [] }
    };

    // First request (uncached)
    const start1 = performance.now();
    await this.makeRequest('/api/multi-agent', 'POST', testData);
    const uncachedTime = performance.now() - start1;

    // Second request (should be cached)
    const start2 = performance.now();
    const cachedResponse = await this.makeRequest('/api/multi-agent', 'POST', testData);
    const cachedTime = performance.now() - start2;

    const improvement = Math.round(((uncachedTime - cachedTime) / uncachedTime) * 100);
    
    console.log(`  Uncached: ${Math.round(uncachedTime)}ms`);
    console.log(`  Cached: ${Math.round(cachedTime)}ms`);
    console.log(`  Improvement: ${improvement}%`);
    
    this.results.push({
      test: 'cache-performance',
      uncachedTime: Math.round(uncachedTime),
      cachedTime: Math.round(cachedTime),
      improvement
    });
  }

  async testMemoryUsage() {
    console.log('\n🧠 Testing Memory Usage...');
    
    const initialHealth = await this.makeRequest('/health');
    const initialMemory = JSON.parse(initialHealth).memory.heapUsed;
    
    // Generate some memory usage
    const promises = [];
    for (let i = 0; i < 20; i++) {
      promises.push(this.makeRequest('/api/simulate', 'POST', {
        workflow: {
          nodes: Array.from({length: 25}, (_, j) => ({ id: `test_${i}_${j}` }))
        }
      }));
    }
    
    await Promise.all(promises);
    
    const finalHealth = await this.makeRequest('/health');
    const finalMemory = JSON.parse(finalHealth).memory.heapUsed;
    
    const memoryGrowth = Math.round((finalMemory - initialMemory) / 1024 / 1024);
    
    console.log(`  Initial memory: ${Math.round(initialMemory / 1024 / 1024)}MB`);
    console.log(`  Final memory: ${Math.round(finalMemory / 1024 / 1024)}MB`);
    console.log(`  Growth: ${memoryGrowth}MB`);
    
    this.results.push({
      test: 'memory-usage',
      initialMemoryMB: Math.round(initialMemory / 1024 / 1024),
      finalMemoryMB: Math.round(finalMemory / 1024 / 1024),
      growthMB: memoryGrowth
    });
  }

  makeRequest(endpoint, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const url = `${this.serverUrl}${endpoint}`;
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  generateReport() {
    console.log('\n📊 Performance Test Results');
    console.log('=' .repeat(40));
    
    // Response time summary
    const responseTimes = this.results.filter(r => r.test === 'response-time');
    const avgResponseTime = Math.round(
      responseTimes.reduce((sum, r) => sum + r.avgTime, 0) / responseTimes.length
    );
    console.log(`Average Response Time: ${avgResponseTime}ms`);
    
    // Concurrent load summary
    const loadTest = this.results.find(r => r.test === 'concurrent-load');
    if (loadTest) {
      console.log(`Concurrent Load: ${loadTest.successful}/${loadTest.totalRequests} (${Math.round(loadTest.successful/loadTest.totalRequests*100)}%)`);
      console.log(`Throughput: ${loadTest.requestsPerSecond} req/sec`);
    }
    
    // Cache performance
    const cacheTest = this.results.find(r => r.test === 'cache-performance');
    if (cacheTest) {
      console.log(`Cache Improvement: ${cacheTest.improvement}%`);
    }
    
    // Memory usage
    const memoryTest = this.results.find(r => r.test === 'memory-usage');
    if (memoryTest) {
      console.log(`Memory Growth: ${memoryTest.growthMB}MB`);
    }
    
    // Overall assessment
    console.log('\n🎯 Assessment:');
    if (avgResponseTime < 500) {
      console.log('✅ Response times: Excellent');
    } else if (avgResponseTime < 1000) {
      console.log('⚠️ Response times: Good');
    } else {
      console.log('❌ Response times: Needs optimization');
    }
    
    if (loadTest && loadTest.successful >= loadTest.totalRequests * 0.9) {
      console.log('✅ Load handling: Excellent');
    } else {
      console.log('⚠️ Load handling: Needs improvement');
    }
    
    if (cacheTest && cacheTest.improvement > 50) {
      console.log('✅ Cache performance: Excellent');
    } else {
      console.log('⚠️ Cache performance: Needs optimization');
    }
  }
}

// Run performance tests
const tester = new PerformanceTester();
tester.runAllTests().catch(console.error);
