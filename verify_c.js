const http = require('http');

function runTest(code, description) {
    const data = JSON.stringify({ code });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/run',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- Test: ${description} ---`);
            console.log('Response:', JSON.parse(responseData));
        });
    });

    req.on('error', (error) => {
        console.error(`Error in test "${description}":`, error);
    });

    req.write(data);
    req.end();
}

// Test 1: C Hello World
runTest(
    '#include <stdio.h>\nint main() { printf("Hello, C Platform!\\n"); return 0; }',
    'C Hello World'
);

// Test 2: Variable (checking integer printing)
setTimeout(() => {
    runTest(
        '#include <stdio.h>\nint main() { int x = 42; printf("Value: %d\\n", x); return 0; }',
        'Integer Variable'
    );
}, 1000);
