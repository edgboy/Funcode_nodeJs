# C Learning Platform

A simple, interactive web-based platform for learning C programming.

## Features
- **Interactive Code Editor**: Write and edit C code with syntax highlighting (powered by CodeMirror).
- **Live Compilation**: Compiles and executes code on the server using `gcc`.
- **Structured Lessons**: Includes built-in lessons (Hello World, Variables, Loops, Functions) with starter code and instructions.
- **Secure Execution**: Runs user code with a strict timeout to prevent infinite loops.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Compiler**: GCC
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Editor Library**: CodeMirror 5

## Prerequisites
- Node.js (v14 or higher)
- GCC (GNU Compiler Collection) installed and available in PATH.

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/edgboy/Funcode_nodeJs.git
    cd funcode
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the server:
    ```bash
    node server.js
    ```

4.  Open your browser and navigate to:
    ```
    http://localhost:3000
    ```

## Development
To add new lessons, edit the `public/lessons.json` file. The structure is simple:
```json
{
    "id": 5,
    "title": "New Lesson",
    "description": "<p>HTML Description</p>",
    "starterCode": "..."
}
```

## Security Note
This project runs C code directly on the host machine using `child_process`. It implements a timeout to handle infinite loops but does not use containerization (Docker). **Do not deploy this to a public server without adding proper sandboxing (e.g., Docker, nsjail).**

## License
ISC
