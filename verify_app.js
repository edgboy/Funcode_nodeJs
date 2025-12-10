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

// Test 1: Hello World
runTest(
    '#include <iostream>\nint main() { std::cout << "Hello, Verification!"; return 0; }',
    'Hello World'
);

// Test 2: Syntax Error
setTimeout(() => {
    runTest(
        '#include <iostream>\nint main() { std::cout << "Missing semicolon" return 0; }',
        'Syntax Error'
    );
}, 1000);

// Test 3: Infinite Loop (Timeout)
setTimeout(() => {
    runTest(
        'int main() { while(true); return 0; }',
        'Infinite Loop'
    );
}, 2000);
