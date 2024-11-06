

export class GeneralChat extends HTMLElement {
    constructor(){
        super();
        this.render();
        this.webSocket();
    }
    render() {
        this.innerHTML = /* html */ `
        <section class="container-box">
            
            <div class="container-chat">
                <div id="conversation" class="container-chat_conversation">
                    

                </div>

                <div id="message" class="container-chat_message">

                    <div class="messageToSend">
                        <input type="text" class="input-text" name="nombre"id="messageInput" placeholder=" Escribe un mensaje">  
                    </div>
                    
                    <div class="send-button">
                        <button id="btnSendMessage"><box-icon name='send' ></box-icon></button>
                    </div>
        
                </div>

                
            </div>

        </section>
        
        `
    }

    webSocket(){
        let socket

        document.addEventListener("DOMContentLoaded", function() {
            socket = new WebSocket("ws://localhost:8080/chat");

            socket.onopen = function(event) {
                let messageArea = document.getElementById("conversation");
                messageArea.innerHTML = /* html */ `
                    <div class="container">
                        <div class="container-img">
                            <img src="img/campus (1).png">
                        </div>
                        <br>
                        <div class="conatiner-iaMessage">Bienvenido a tu chat con campuslands</div><br>
                    </div>
                `;
                console.log("Conexión WebSocket establecida.");
            };

            socket.onmessage = function(event) {
                let messageArea = document.getElementById("conversation");
                if (messageArea) {
                    messageArea.innerHTML += '<div class="conatiner-iaMessage"><div class="iaMessage">' + event.data + '</div></div><br>';
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
                let messageArea = document.getElementById("conversation");
                messageArea.innerHTML += '<div class="conatiner-userMessage"><div class="userMessage">' + fullMessage+ '</div></div><br>';
                socket.send(fullMessage);
                messageInput.value = '';
            }
            
        }
    }
}
customElements.define("general-chat", GeneralChat);