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
