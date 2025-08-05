# WAYNE Chat Assistant - Simple Project Structure

Here's a basic project structure for your WAYNE Chat Assistant using only HTML, CSS, and JavaScript:

```
wayne-chat-assistant/
│
├── index.html          # Main HTML file
├── style.css           # Main stylesheet
├── script.js           # Main JavaScript file
│
├── docs/               # Documentation/questions storage
│   ├── questions.json  # JSON file storing questions and answers
│   └── update.js       # Script to update documentation
│
├── api/                # Simple API simulation
│   └── api.js          # API response handler
│
└── assets/             # Optional assets folder
    ├── images/         # For any images
    └── sounds/         # For notification sounds, etc.
```

## File Contents

### 1. index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WAYNE Chat Assistant</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="chat-container">
        <header>
            <h1>WAYNE Assistant</h1>
        </header>
        
        <div class="chat-box" id="chatBox">
            <!-- Messages will appear here -->
        </div>
        
        <div class="input-area">
            <input type="text" id="userInput" placeholder="Ask me anything...">
            <button id="sendButton">Send</button>
        </div>
        
        <div class="admin-panel">
            <button id="updateDocs">Update Documentation</button>
            <textarea id="newQuestion" placeholder="New question and answer (JSON format)"></textarea>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### 2. style.css
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

.chat-container {
    max-width: 800px;
    margin: 20px auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

header {
    background-color: #4285f4;
    color: white;
    padding: 15px;
    text-align: center;
}

.chat-box {
    height: 400px;
    overflow-y: auto;
    padding: 15px;
}

.message {
    margin-bottom: 15px;
    padding: 10px 15px;
    border-radius: 18px;
    max-width: 70%;
}

.user-message {
    background-color: #e3f2fd;
    margin-left: auto;
    border-bottom-right-radius: 0;
}

.bot-message {
    background-color: #f1f1f1;
    margin-right: auto;
    border-bottom-left-radius: 0;
}

.input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
}

.input-area input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
}

.input-area button {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #4285f4;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
}

.admin-panel {
    padding: 15px;
    background-color: #f9f9f9;
    border-top: 1px solid #ddd;
}

.admin-panel textarea {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 100px;
}
```

### 3. script.js
```javascript
// DOM Elements
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const updateDocsButton = document.getElementById('updateDocs');
const newQuestionTextarea = document.getElementById('newQuestion');

// Load questions from JSON file
let qaPairs = [];

fetch('docs/questions.json')
    .then(response => response.json())
    .then(data => {
        qaPairs = data;
    })
    .catch(error => {
        console.error('Error loading questions:', error);
        addMessage('bot', 'Sorry, I\'m having trouble loading my knowledge base.');
    });

// Send message function
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    addMessage('user', message);
    userInput.value = '';
    
    // Simulate API call
    const response = getBotResponse(message);
    setTimeout(() => {
        addMessage('bot', response);
    }, 500);
}

// Add message to chat box
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Get bot response
function getBotResponse(userMessage) {
    // Check for exact matches first
    const exactMatch = qaPairs.find(qa => 
        qa.question.toLowerCase() === userMessage.toLowerCase()
    );
    
    if (exactMatch) return exactMatch.answer;
    
    // Check for partial matches
    const partialMatch = qaPairs.find(qa => 
        userMessage.toLowerCase().includes(qa.question.toLowerCase())
    );
    
    if (partialMatch) return partialMatch.answer;
    
    // Check for keyword matches
    const keywordsMatch = qaPairs.find(qa => 
        qa.keywords.some(keyword => 
            userMessage.toLowerCase().includes(keyword.toLowerCase())
        )
    );
    
    if (keywordsMatch) return keywordsMatch.answer;
    
    // Default response
    return "I'm not sure how to answer that. You can help me learn by adding this question to my knowledge base.";
}

// Update documentation
function updateDocumentation() {
    try {
        const newQA = JSON.parse(newQuestionTextarea.value);
        qaPairs.push(newQA);
        
        // In a real app, you would send this to a server to update the JSON file
        // For this demo, we'll just store it in memory
        addMessage('bot', 'Thank you! I\'ve updated my knowledge base.');
        newQuestionTextarea.value = '';
        
        // Here you would typically make an API call to update the docs/questions.json file
        console.log('New Q&A pair:', newQA);
    } catch (error) {
        addMessage('bot', 'Sorry, there was an error updating my knowledge. Please check the format.');
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

updateDocsButton.addEventListener('click', updateDocumentation);

// Initial greeting
setTimeout(() => {
    addMessage('bot', 'Hello! I\'m WAYNE, your chat assistant. How can I help you today?');
}, 1000);
```

### 4. docs/questions.json
```json
[
    {
        "question": "What is WAYNE?",
        "answer": "WAYNE is a chat assistant designed to help answer your questions.",
        "keywords": ["wayne", "assistant", "what is"]
    },
    {
        "question": "How do I update documentation?",
        "answer": "You can add new questions and answers using the admin panel at the bottom of the chat interface.",
        "keywords": ["update", "documentation", "add", "new question"]
    },
    {
        "question": "Hello",
        "answer": "Hi there! How can I assist you today?",
        "keywords": ["hi", "hello", "hey"]
    }
]
```

### 5. api/api.js (Simple API simulation)
```javascript
// This would be the API endpoint handler in a real implementation
// For this frontend-only version, we'll simulate it

function handleAPIRequest(endpoint, data) {
    switch(endpoint) {
        case '/get-answer':
            return simulateDatabaseQuery(data.question);
        case '/update-docs':
            return { status: 'success', message: 'Documentation updated' };
        default:
            return { status: 'error', message: 'Invalid endpoint' };
    }
}

function simulateDatabaseQuery(question) {
    // In a real app, this would query your database
    // For this demo, we'll use the qaPairs from script.js
    
    const match = qaPairs.find(qa => 
        qa.question.toLowerCase() === question.toLowerCase() ||
        qa.keywords.some(keyword => question.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    return match 
        ? { status: 'success', answer: match.answer }
        : { status: 'not_found', answer: "I don't know the answer to that question." };
}

// Note: In a real implementation, you would have server-side code to handle these API requests
// This is just a simulation for the frontend-only version
```

## How to Use

1. The chat interface allows users to ask questions
2. The system checks the questions.json file for matching questions/answers
3. The admin panel allows adding new Q&A pairs (in a real app, this would update the JSON file)
4. The API simulation shows how responses would be handled in a backend system

## API Simulation Notes

While this is a frontend-only implementation, the `api/api.js` file demonstrates how the API would work. In a real implementation:

1. You would need a backend server (Node.js, Python, PHP, etc.)
2. The server would handle:
   - Storing and retrieving questions/answers from a database
   - Processing API requests
   - Updating documentation files
3. The frontend would make fetch/AJAX calls to these API endpoints

This structure gives you a starting point that you can expand with actual backend functionality when needed.
