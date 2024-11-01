let socket

document.addEventListener("DOMContentLoaded", function() {
    socket = new WebSocket("ws://localhost:8080/chat");

    socket.onopen = function(event) {
        console.log("Conexión WebSocket establecida.");
    };

    socket.onmessage = function(event) {
        let messageArea = document.getElementById("user");
        if (messageArea) {
            messageArea.innerHTML += '<div class="conatiner-userMessage"><div class="userMessage">' + event.data + '</div></div><br>';
        } else {
            console.error("Elemento con ID 'conversation' no encontrado.");
        }
    };

    socket.onclose = function(event) {
        console.log("Conexión WebSocket cerrada.");
    };

    socket.onerror = function(error) {
        console.error("Error en WebSocket:", error);
    };
});


let send = document.getElementById("btnSendMessage");
send.onclick = sendMessage;
const messageInput = document.getElementById("messageInput");


messageInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendMessage();          
    }
});

function sendMessage() {
    if(messageInput.value.trim() ==="" ){
        
    } else {
        let fullMessage = messageInput.value;
        socket.send(fullMessage);
        messageInput.value = '';
    }
    
}