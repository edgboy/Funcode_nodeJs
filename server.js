const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure temp directory exists
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

app.post('/run', (req, res) => {
    const code = req.body.code;
    const jobId = Date.now();
    const sourcePath = path.join(TEMP_DIR, `${jobId}.c`);
    const binaryPath = path.join(TEMP_DIR, `${jobId}.out`);

    if (!code) {
        return res.status(400).json({ output: 'No code provided' });
    }

    // Write code to file
    fs.writeFile(sourcePath, code, (err) => {
        if (err) {
            return res.status(500).json({ output: 'Failed to write file: ' + err.message });
        }

        // Compile
        exec(`gcc "${sourcePath}" -o "${binaryPath}"`, (compileErr, stdout, stderr) => {
            if (compileErr) {
                // Compilation failed
                // Cleanup source
                fs.unlink(sourcePath, () => {});
                return res.json({ output: stderr || compileErr.message });
            }

            // Run with timeout (2 seconds)
            exec(`"${binaryPath}"`, { timeout: 2000 }, (runErr, runStdout, runStderr) => {
                // Cleanup files
                fs.unlink(sourcePath, () => {});
                fs.unlink(binaryPath, () => {});

                if (runErr) {
                    if (runErr.killed) {
                        return res.json({ output: 'Error: Time Limit Exceeded' });
                    }
                    return res.json({ output: runStderr || runErr.message });
                }

                res.json({ output: runStdout });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
