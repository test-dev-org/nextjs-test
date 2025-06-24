const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECURITY_THRESHOLD = 310000;
const VULNERABLE_HASHES = ['SHA1', 'MD5'];

function scanFiles(dir) {
  const results = [];
  
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    
    if (dirent.isDirectory()) {
      results.push(...scanFiles(fullPath));
    } else if (/\.(js|ts|jsx|tsx)$/.test(firent.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const pbkdf2Pattern = /CryptoJS\.PBKDF2\(([^)]+)/g;
      
      let match;
      while ((match = pbkdf2Pattern.exec(content)) !== null) {
        const [fullMatch, args] = match;
        const line = content.substring(0, match.index).split('\n').length;
        
        // Check for dangerous patterns
        const isVulnerable = 
          !args.includes('iterations:') || 
          args.match(/iterations:\s*(\d+)/)?.[1] < SECURITY_THRESHOLD ||
          VULNERABLE_HASHES.some(h => args.includes(h));
        
        if (isVulnerable) {
          results.push({
            file: fullPath,
            line,
            code: fullMatch.substring(0, 100) + '...',
            severity: 'CRITICAL'
          });
        }
      }
    }
  });
  
  return results;
}

// Run scan
const vulnerabilities = scanFiles(process.cwd());
console.log(JSON.stringify(vulnerabilities, null, 2));
if (vulnerabilities.length > 0) process.exit(1);
