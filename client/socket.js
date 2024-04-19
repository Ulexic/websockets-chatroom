let username = null;

// Prompt the user for their name
while(username === null || username === "") {
    username = prompt("Please enter your name");
}

// Connect to the socket server
var socket = io('http://localhost:8080');

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    // If the input is not empty, send the message then clear the input
    if (input.value) {
        const data = {
            message: input.value,
            author: username
        };

        socket.emit('send', JSON.stringify(data));
        input.value = '';
    }
});

// When a message is received, add it to the list of messages
socket.on('pull', function(msg) {
    let data = JSON.parse(msg);
    
    var item = document.createElement('li');
    item.textContent = `${data.author}: ${data.message}`;

    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});