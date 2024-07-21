document.getElementById('send-button').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const chatBox = document.getElementById('chat-box');

    if (messageInput.value.trim() !== "") {
        const message = document.createElement('div');
        message.textContent = messageInput.value;
        chatBox.appendChild(message);
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});
