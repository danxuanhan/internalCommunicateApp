const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const sendButton = document.getElementById('send-button');
const logoutButton = document.getElementById('logout-button');
const addContactButton = document.getElementById('add-contact-button');
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const contactList = document.getElementById('contact-list');
const contactNameInput = document.getElementById('contact-name');
const contactEmailInput = document.getElementById('contact-email');
const authDiv = document.getElementById('auth');
const chatDiv = document.getElementById('chat');

registerButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.status === 201) {
        alert('User registered');
    } else {
        alert('Registration failed');
    }
});

loginButton.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        authDiv.style.display = 'none';
        chatDiv.style.display = 'block';
        loadContacts();
        loadPublicMessages();
    } else {
        alert('Login failed');
    }
});

sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    const token = localStorage.getItem('token');

    if (message.trim() !== "") {
        const response = await fetch('/api/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        if (response.status === 200) {
            const data = await response.json();
            displayMessage(data.sender, data.message);
            messageInput.value = '';
        } else {
            alert('Failed to send message');
        }
    }
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    authDiv.style.display = 'block';
    chatDiv.style.display = 'none';
});

addContactButton.addEventListener('click', async () => {
    const contactName = contactNameInput.value;
    const contactEmail = contactEmailInput.value;
    const token = localStorage.getItem('token');

    if (contactName.trim() !== "" && contactEmail.trim() !== "") {
        const response = await fetch('/api/contacts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ contactName, contactEmail })
        });

        if (response.status === 200) {
            loadContacts();
            contactNameInput.value = '';
            contactEmailInput.value = '';
        } else {
            alert('Failed to add contact');
        }
    }
});

async function loadContacts() {
    const token = localStorage.getItem('token');

    const response = await fetch('/api/contacts/list', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 200) {
        const contacts = await response.json();
        contactList.innerHTML = '';
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.textContent = contact.name;
            
            const emailButton = document.createElement('button');
            emailButton.textContent = 'Send Email';
            emailButton.className = 'button';
            emailButton.addEventListener('click', () => sendEmail(contact.email));
            
            li.appendChild(emailButton);
            contactList.appendChild(li);
        });
    } else {
        alert('Failed to load contacts');
    }
}

function sendEmail(email) {
    window.location.href = `mailto:${email}`;
}

async function loadPublicMessages() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/messages/public', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const messages = await response.json();
            chatBox.innerHTML = '';
            messages.forEach(msg => displayMessage(msg.sender, msg.message));
        } else {
            throw new Error('Failed to load public messages');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to load messages');
    }
}

function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
