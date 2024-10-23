let username = '';
const correctPassword = 'Sri@123';  // The correct password for everyone

// Function to log in and enter chat
function login() {
    const usernameInput = document.getElementById('usernameInput').value.trim();
    const passwordInput = document.getElementById('passwordInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (usernameInput && passwordInput === correctPassword) {
        username = usernameInput;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'block';
        document.getElementById('chatUsername').innerText = `Welcome, ${username}`;
        loadMessages();
    } else if (!usernameInput) {
        errorMessage.innerText = "Please enter a username.";
    } else if (passwordInput !== correctPassword) {
        errorMessage.innerText = "Incorrect password. Please try again.";
    }
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText) {
        const message = {
            user: username,
            text: messageText,
            timestamp: new Date().toLocaleString()
        };

        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        })
        .then(response => response.json())
        .then(data => {
            appendMessageToChat(message);
            messageInput.value = '';
        });
    }
}

// Function to load messages from the server
function loadMessages() {
    fetch('/get-messages')
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => appendMessageToChat(message));
        });
}

// Function to append message to chat window
function appendMessageToChat(message) {
    const chatWindow = document.getElementById('chatWindow');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.innerHTML = `
        <span class="user">${message.user}:</span> 
        <span class="text">${message.text}</span>
        <span class="time">(${message.timestamp})</span>
    `;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
