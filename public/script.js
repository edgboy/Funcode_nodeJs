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

    let modules = [];
    let allLessons = []; // Flattened list for easy navigation
    let currentLessonIndex = 0;

    // Fetch and Load Lessons
    try {
        const res = await fetch('lessons.json');
        const data = await res.json();
        modules = data.modules;
        
        // Flatten lessons for navigation
        modules.forEach(module => {
            module.lessons.forEach(lesson => {
                allLessons.push(lesson);
            });
        });

        renderLessonSidebar();
        
        if (allLessons.length > 0) {
            loadLesson(0);
        }
    } catch (err) {
        console.error('Failed to load lessons', err);
        lessonContent.innerHTML = '<p class="error">Failed to load course content.</p>';
    }

    function renderLessonSidebar() {
        lessonList.innerHTML = '';
        
        let globalIndex = 0;
        
        modules.forEach(module => {
            // Create Module Header
            const moduleHeader = document.createElement('h4');
            moduleHeader.className = 'module-header';
            moduleHeader.textContent = module.title;
            lessonList.appendChild(moduleHeader);

            // Create Lesson List for this module
            const ul = document.createElement('ul');
            ul.className = 'module-lessons';
            
            module.lessons.forEach(lesson => {
                const li = document.createElement('li');
                li.textContent = lesson.title;
                li.dataset.index = globalIndex; // Store global index
                
                // Closure to capture current globalIndex
                const indexToLoad = globalIndex;
                li.addEventListener('click', () => loadLesson(indexToLoad));
                
                ul.appendChild(li);
                globalIndex++;
            });
            
            lessonList.appendChild(ul);
        });
    }

    function loadLesson(index) {
        if (index < 0 || index >= allLessons.length) return;
        
        currentLessonIndex = index;
        const lesson = allLessons[index];
        
        // Update Sidebar Active State
        document.querySelectorAll('.module-lessons li').forEach(li => {
            li.classList.remove('active');
            if (parseInt(li.dataset.index) === index) {
                li.classList.add('active');
            }
        });

        // Update Content
        renderLessonContent(lesson);
        editor.setValue(lesson.starterCode);
        
        // Reset Output
        outputElement.textContent = 'Ready to run...';
        outputElement.className = '';
    }
    
    function renderLessonContent(lesson) {
        const navButtons = `
            <div class="lesson-nav">
                <button id="prevBtn" ${currentLessonIndex === 0 ? 'disabled' : ''}>&larr; Previous</button>
                <button id="nextBtn" ${currentLessonIndex === allLessons.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
            </div>
        `;
        
        lessonContent.innerHTML = lesson.description + navButtons;
        
        // Re-attach listeners to new buttons
        document.getElementById('prevBtn')?.addEventListener('click', () => loadLesson(currentLessonIndex - 1));
        document.getElementById('nextBtn')?.addEventListener('click', () => loadLesson(currentLessonIndex + 1));
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
