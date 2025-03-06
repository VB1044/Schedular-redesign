// DOM elements
const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Focus input on page load
window.onload = function() {
    userInput.focus();
};

// Get current time formatted
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutes} ${ampm}`;
}

// Send message function
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    userMessageDiv.innerHTML = `${message}<div class="message-time">${getCurrentTime()}</div>`;
    chatBody.appendChild(userMessageDiv);
    
    // Clear input
    userInput.value = '';
    userInput.focus();
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Show typing indicator
    typingIndicator.style.display = 'block';
    
    // Simulate bot response after delay
    setTimeout(() => {
        // Hide typing indicator
        typingIndicator.style.display = 'none';
        
        // Create random responses
        const responses = [
            "I understand what you're saying. How can I assist further?",
            "That's interesting! Let me know if you need more information.",
            "I'm here to help. What else would you like to know?",
            "Thanks for sharing that. Is there anything specific you're looking for?",
            "I'm processing your request. Can you provide more details?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add bot response
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.innerHTML = `${randomResponse}<div class="message-time">${getCurrentTime()}</div>`;
        chatBody.appendChild(botMessageDiv);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1500);
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Speech recognition animation
function animateMicButton(isListening) {
    const micButton = document.getElementById('voiceBtn');
    
    if (isListening) {
        let pulseCount = 0;
        micButton.style.color = '#dc2626';
        
        const pulseInterval = setInterval(() => {
            micButton.style.transform = pulseCount % 2 === 0 ? 'scale(1.1)' : 'scale(1)';
            pulseCount++;
            
            if (!isListening) {
                clearInterval(pulseInterval);
                micButton.style.transform = 'scale(1)';
            }
        }, 500);
        
        return pulseInterval;
    } else {
        micButton.style.color = '';
        micButton.style.transform = 'scale(1)';
    }
}

// Voice button functionality
let isListening = false;
let pulseInterval;

voiceBtn.addEventListener('click', () => {
    if (isListening) return;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;
        
        isListening = true;
        pulseInterval = animateMicButton(true);
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            
            // Stop animation
            isListening = false;
            clearInterval(pulseInterval);
            animateMicButton(false);
            
            // Small delay before sending to give visual feedback
            setTimeout(() => {
                sendMessage();
            }, 300);
        };
        
        recognition.onerror = function() {
            isListening = false;
            clearInterval(pulseInterval);
            animateMicButton(false);
            
            // Add error message to chat
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'message bot-message';
            botMessageDiv.innerHTML = `I couldn't hear you. Please try again or type your message.<div class="message-time">${getCurrentTime()}</div>`;
            chatBody.appendChild(botMessageDiv);
            
            chatBody.scrollTop = chatBody.scrollHeight;
        };
        
        recognition.onend = function() {
            isListening = false;
            clearInterval(pulseInterval);
            animateMicButton(false);
        };
    } else {
        // Add error message to chat if speech recognition not supported
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'message bot-message';
        botMessageDiv.innerHTML = `Speech recognition is not supported in your browser. Please type your message instead.<div class="message-time">${getCurrentTime()}</div>`;
        chatBody.appendChild(botMessageDiv);
        
        chatBody.scrollTop = chatBody.scrollHeight;
    }
});

// Disable send button when input is empty
userInput.addEventListener('input', () => {
    sendBtn.disabled = userInput.value.trim() === '';
    sendBtn.style.opacity = userInput.value.trim() === '' ? '0.5' : '1';
});

// Initial button state
sendBtn.disabled = true;
sendBtn.style.opacity = '0.5';