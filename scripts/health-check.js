/**
 * 🏥 Health Check Script - Phase 4
 * Comprehensive health monitoring for all Phase 4 services
 */

import http from 'http';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class HealthChecker {
  constructor() {
    this.services = {
      server: { url: 'http://localhost:3000/health', name: 'Phase 4 Server' },
      redis: { command: 'redis-cli ping', name: 'Redis Cache' }
    };
    this.results = new Map();
  }

  async checkAll() {
    console.log('🏥 Phase 4 Health Check Starting...\n');

    // Check server health
    await this.checkServer();
    
    // Check Redis
    await this.checkRedis();
    
    // Check system resources
    await this.checkSystemResources();
    
    // Generate report
    this.generateReport();
  }

  async checkServer() {
    try {
      const response = await this.makeRequest(this.services.server.url);
      const data = JSON.parse(response);
      
      this.results.set('server', {
        status: 'healthy',
        uptime: data.uptime,
        memory: data.memory,
        activeConnections: data.activeConnections,
        details: data
      });
      
      console.log('✅ Server: Healthy');
      console.log(`   Uptime: ${Math.floor(data.uptime / 60)}m ${data.uptime % 60}s`);
      console.log(`   Memory: ${Math.round(data.memory.heapUsed / 1024 / 1024)}MB`);
    } catch (error) {
      this.results.set('server', {
        status: 'error',
        error: error.message
      });
      console.log('❌ Server: Error - ' + error.message);
    }
  }

  async checkRedis() {
    try {
      const { stdout } = await execAsync('redis-cli ping');
      if (stdout.trim() === 'PONG') {
        const info = await execAsync('redis-cli info memory');
        this.results.set('redis', {
          status: 'healthy',
          response: 'PONG',
          memory: info.stdout
        });
        console.log('✅ Redis: Connected');
      } else {
        throw new Error('Unexpected Redis response');
      }
    } catch (error) {
      this.results.set('redis', {
        status: 'error',
        error: error.message
      });
      console.log('❌ Redis: ' + error.message);
    }
  }

  async checkSystemResources() {
    try {
      // Check available ports
      const ports = await this.checkPorts([3000, 6379]);
      
      this.results.set('system', {
        status: 'healthy',
        ports,
        nodeVersion: process.version,
        platform: process.platform
      });
      
      console.log('✅ System: Resources available');
      console.log(`   Node.js: ${process.version}`);
      console.log(`   Platform: ${process.platform}`);
    } catch (error) {
      this.results.set('system', {
        status: 'error',
        error: error.message
      });
      console.log('❌ System: ' + error.message);
    }
  }

  async checkPorts(ports) {
    const results = {};
    for (const port of ports) {
      try {
        await this.testPort(port);
        results[port] = 'in-use';
      } catch {
        results[port] = 'available';
      }
    }
    return results;
  }

  testPort(port) {
    return new Promise((resolve, reject) => {
      const server = http.createServer();
      server.listen(port, () => {
        server.close();
        reject(new Error('Port available'));
      });
      server.on('error', () => {
        resolve('Port in use');
      });
    });
  }

  makeRequest(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', reject);
      req.setTimeout(5000, () => reject(new Error('Request timeout')));
    });
  }

  generateReport() {
    console.log('\n📊 Health Check Summary');
    console.log('='.repeat(30));
    
    let healthyCount = 0;
    let totalCount = 0;
    
    for (const [service, result] of this.results.entries()) {
      totalCount++;
      if (result.status === 'healthy') {
        healthyCount++;
      }
    }
    
    const healthPercentage = Math.round((healthyCount / totalCount) * 100);
    console.log(`Overall Health: ${healthPercentage}% (${healthyCount}/${totalCount})`);
    
    if (healthPercentage === 100) {
      console.log('🎉 All systems operational!');
    } else {
      console.log('⚠️ Some issues detected. Check logs above.');
    }
  }
}

// Run health check
const checker = new HealthChecker();
checker.checkAll().catch(console.error);
