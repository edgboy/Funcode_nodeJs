const fs = require('fs');
const path = require('path');

const lessonsPath = path.join(__dirname, 'public', 'lessons.json');

try {
    const data = fs.readFileSync(lessonsPath, 'utf8');
    const json = JSON.parse(data);

    if (!json.modules) {
        throw new Error("Missing 'modules' key in lessons.json");
    }

    console.log(`Found ${json.modules.length} modules.`);

    let totalLessons = 0;
    json.modules.forEach(m => {
        console.log(`Module: ${m.title} (${m.lessons.length} lessons)`);
        totalLessons += m.lessons.length;
    });

    console.log(`Total lessons: ${totalLessons}`);
    
    if (totalLessons < 9) {
        console.error("Expected at least 9 lessons, found " + totalLessons);
        process.exit(1);
    }
    
    console.log("Verification Passed: Structure is valid.");

} catch (err) {
    console.error("Verification Failed:", err.message);
    process.exit(1);
}
