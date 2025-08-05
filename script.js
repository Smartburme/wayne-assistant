// DOM Elements
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const updateDocsButton = document.getElementById('updateDocs');
const newQuestionTextarea = document.getElementById('newQuestion');

// Global Variables
let qaPairs = [];
let currentCategory = null;
let sessionHistory = [];

// Initialize Chat
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    displayWelcomeMessage();
    setupEventListeners();
});

// Load questions from JSON
async function loadQuestions() {
    try {
        const response = await fetch('docs/questions.json');
        const data = await response.json();
        qaPairs = data.flatMap(category => 
            category.questions.map(q => ({
                ...q,
                category: category.category
            }))
        );
    } catch (error) {
        console.error('Error loading questions:', error);
        addSystemMessage('Error loading knowledge base. Please try again later.');
    }
}

// Display welcome message
function displayWelcomeMessage() {
    setTimeout(() => {
        addMessage('bot', 'ဟယ်လို! WAYNE Chat Assistant မှ ကြိုဆိုပါသည်။ မေးခွန်းများမေးမြန်းနိုင်ပါသည်။', 'welcome');
        
        // Show category buttons
        const categories = [...new Set(qaPairs.map(q => q.category))];
        if (categories.length > 0) {
            const buttonsHTML = categories.map(cat => 
                `<button class="category-btn" data-category="${cat}">${cat}</button>`
            ).join('');
            
            addMessage('bot', 
                `ဤကဏ္ဍများမှ ရွေးချယ်မေးမြန်းနိုင်ပါသည်:<br><div class="category-btns">${buttonsHTML}</div>`,
                'categories'
            );
        }
    }, 500);
}

// Setup event listeners
function setupEventListeners() {
    // Send message on button click or Enter
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    
    // Update documentation
    updateDocsButton.addEventListener('click', updateDocumentation);
    
    // Dynamic category button handling
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            selectCategory(e.target.dataset.category);
        }
    });
}

// Send message function
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    addMessage('user', message);
    userInput.value = '';
    
    // Process message after short delay
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage('bot', response);
    }, 300);
}

// Add message to chat
function addMessage(sender, text, type = 'normal') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`, type);
    
    // Format links to be clickable
    const formattedText = text.replace(
        /<a href='(.*?)' target='_blank'>(.*?)<\/a>/g, 
        '<a href="$1" target="_blank" class="chat-link">$2</a>'
    );
    
    messageDiv.innerHTML = formattedText;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Add to session history
    sessionHistory.push({
        sender,
        text,
        timestamp: new Date().toISOString()
    });
}

// Get bot response
function getBotResponse(userMessage) {
    // Check for clear commands
    if (userMessage.toLowerCase().includes('clear chat')) {
        chatBox.innerHTML = '';
        sessionHistory = [];
        return 'Chat history has been cleared.';
    }
    
    // Check for help command
    if (userMessage.toLowerCase().includes('help')) {
        return 'You can ask me questions or select a category to narrow down your query. Try asking about weather, health, or technology.';
    }
    
    // Filter by current category if set
    const searchPool = currentCategory 
        ? qaPairs.filter(q => q.category === currentCategory)
        : qaPairs;
    
    // Check for exact matches first
    const exactMatch = searchPool.find(q => 
        q.question.toLowerCase() === userMessage.toLowerCase()
    );
    if (exactMatch) return exactMatch.answer;
    
    // Check for partial matches
    const partialMatches = searchPool.filter(q => 
        userMessage.toLowerCase().includes(q.question.toLowerCase()) ||
        q.keywords.some(kw => 
            userMessage.toLowerCase().includes(kw.toLowerCase())
        )
    );
    
    if (partialMatches.length > 0) {
        // If only one match, return it
        if (partialMatches.length === 1) {
            return partialMatches[0].answer;
        }
        
        // If multiple matches, show options
        const optionsHTML = partialMatches.slice(0, 3).map((q, i) => 
            `<div class="response-option" data-index="${i}">${q.question}</div>`
        ).join('');
        
        return `Did you mean:<br>${optionsHTML}<br>Please click on the most relevant question.`;
    }
    
    // No matches found
    return `I couldn't find an answer to "${userMessage}". Try rephrasing or ask about a different topic.`;
}

// Select category
function selectCategory(category) {
    currentCategory = category;
    addMessage('bot', `You selected: <strong>${category}</strong>. Ask anything about this topic.`, 'category-selection');
}

// Update documentation
function updateDocumentation() {
    const newContent = newQuestionTextarea.value.trim();
    if (!newContent) return;
    
    try {
        // In a real app, you would send this to a server
        console.log('New content to add:', newContent);
        addMessage('bot', 'Thank you! The new information has been recorded for review.', 'update');
        newQuestionTextarea.value = '';
    } catch (error) {
        addMessage('bot', 'There was an error processing your update. Please check the format and try again.', 'error');
    }
}

// Add system message
function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'system-message';
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
