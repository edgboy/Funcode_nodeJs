document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const lessonList = document.getElementById('lessonList');
    const lessonContent = document.getElementById('lessonContent');
    const runBtn = document.getElementById('runBtn');
    const outputElement = document.getElementById('output');

    // Initialize Editor
    const editor = CodeMirror.fromTextArea(document.getElementById('codeEditor'), {
        mode: 'text/x-csrc', // C mode
        theme: 'dracula',
        lineNumbers: true,
        autoCloseBrackets: true,
        indentUnit: 4
    });

    let lessons = [];

    // Fetch and Load Lessons
    try {
        const res = await fetch('lessons.json');
        lessons = await res.json();
        renderLessonList();
        if (lessons.length > 0) loadLesson(0);
    } catch (err) {
        console.error('Failed to load lessons', err);
        lessonContent.innerHTML = '<p class="error">Failed to load course content.</p>';
    }

    function renderLessonList() {
        lessonList.innerHTML = '';
        lessons.forEach((lesson, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${lesson.title}`;
            li.addEventListener('click', () => loadLesson(index));
            lessonList.appendChild(li);
        });
    }

    function loadLesson(index) {
        const lesson = lessons[index];
        
        // Update UI logic
        document.querySelectorAll('#lessonList li').forEach(li => li.classList.remove('active'));
        lessonList.children[index].classList.add('active');

        lessonContent.innerHTML = lesson.description;
        editor.setValue(lesson.starterCode);
        outputElement.textContent = 'Ready to run...';
        outputElement.className = '';
    }

    // Run Code Logic
    runBtn.addEventListener('click', async () => {
        const code = editor.getValue();
        
        runBtn.disabled = true;
        runBtn.textContent = 'Running...';
        outputElement.textContent = 'Compiling and executing...';
        outputElement.className = '';

        try {
            const response = await fetch('/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            
            outputElement.textContent = data.output;
            
            if (data.output.toLowerCase().includes('error')) {
                outputElement.classList.add('error');
            } else {
                outputElement.classList.add('success');
            }
        } catch (error) {
            outputElement.textContent = 'Error: Connection failed.';
            outputElement.classList.add('error');
        } finally {
            runBtn.disabled = false;
            runBtn.textContent = 'Run Code ▶';
        }
    });
});
