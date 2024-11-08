export class GeneralChat extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.webSocket();
        this.addEventListeners();
    }

    render() {
        this.innerHTML = /* html */ `
        <section class="container-box">
            <div class="container-chat">
                <div class="container-chat_conversation">
                    <div class="container-welcome">
                        <div class="container-img">
                            <img src="/img/campus (1).png">
                            
                        </div>
                        <br>
                        <div class="welcome-text">
                            ¡Hola y bienvenid@ a tu chat con Campuslands! Soy Campi, tu asistente virtual, y estoy aquí para ayudarte a resolver todas tus dudas sobre Campuslands. No dudes en preguntarme cualquier cosa; estaré encantad@ de asistirte.
                        </div>
                    </div>
                    <br>
                    <div class="titulo" id="faqTitle">Preguntas frecuentes</div>
                    <div id="questions-container">
                        <button class="faq-button" id="pregunta1">¿Qué es Campuslands?</button>
                        <button class="faq-button" id="pregunta2">¿Dónde están ubicados?</button>
                        <button class="faq-button" id="pregunta3">¿Cuáles son los requisitos para ser parte de Campuslands?</button>
                        <button class="faq-button" id="pregunta4">¿Cuánto cuesta ingresar?</button>
                        <button class="faq-button" id="pregunta5">¿Cómo es el plan académico?</button>
                        <button class="faq-button" id="pregunta6">¿Qué oportunidades laborales hay?</button>
                    </div>
                    <br>
                    <div id="conversation" class="container-answers"> </div>
                </div>  
                
                <div id="message" class="container-chat_message">
                    <div class="messageToSend">
                        <input type="text" class="input-text" name="nombre" id="messageInput" placeholder=" Escribe un mensaje">  
                    </div>
                    <div class="send-button">
                        <button id="btnSendMessage"><box-icon name='send'></box-icon></button>
                    </div>
                </div>
            </div>
            <br>
            <ul class="wrapper">
                <li class="icon facebook">
                    <a href="https://www.facebook.com/Campuslands/?locale=es_LA" target="_blank">
                        <box-icon type='logo' name='facebook-circle'></box-icon>
                    </a>
                    <span class="tooltip">Facebook</span>
                </li>
                <li class="icon facebook">
                    <span class="tooltip">Linkedin</span>
                    <a href="https://www.linkedin.com/company/campuslands" target="_blank">
                        <box-icon name='linkedin-square' type='logo'></box-icon>
                    </a>
                </li>
                <li class="icon facebook">
                    <span class="tooltip">Instagram</span>
                    <a href="https://www.instagram.com/campuslands/" target="_blank">
                        <box-icon type='logo' name='instagram'></box-icon>
                    </a>
                </li>
                <li class="icon facebook">
                    <span class="tooltip">WhatsApp</span>
                    <a href="https://wa.me/573177709345" target="_blank">
                        <box-icon name='whatsapp' type='logo'></box-icon>
                    </a>
                </li>
                <li class="icon facebook">
                    <span class="tooltip">Inscribete</span>
                    <a href="https://miniurl.cl/RegistroCampuslands" target="_blank">
                        <box-icon name='notepad'></box-icon>
                    </a>
                </li>
            </ul>

        </section>
        `;
    }

    webSocket() {
        let socket;
        document.addEventListener("DOMContentLoaded", () => {
            socket = new WebSocket("ws://localhost:8080/chat");
            socket.onopen = () => {
                console.log("Conexión WebSocket establecida.");
            };

            let messageCount = 0;
            socket.onmessage = (event) => {
                let messageArea = document.getElementById("conversation");
                if (messageArea) {
                    messageArea.innerHTML += '<div class="container-iaMessage"><div class="iaMessage">' + event.data + '</div></div><br>';
                    messageArea.scrollTop = messageArea.scrollHeight;

                    messageCount++;
                    if (messageCount % 5 === 0) {
                        messageArea.innerHTML += `
                            <div class="container-iaMessage"><div class="iaMessage">
                            ¡Inscríbete en Campuslands y transforma tu vida en solo un año! 🚀 Aprende tecnología, inglés y habilidades clave para destacar en el mercado laboral.
                            <br>Regístrate aquí: <a href="https://miniurl.cl/RegistroCampuslands" target="_blank">Inscripción a Campuslands</a>
                            <br>¡Cupos limitados, no te quedes fuera!
                            </div></div><br>
                            `;
                        messageArea.scrollTop = messageArea.scrollHeight; // Asegura el scroll al final
                    }
                } else {
                    console.error("Elemento con ID 'conversation' no encontrado.");
                }
            };
            socket.onclose = () => {
                console.log("Conexión WebSocket cerrada.");
            };
            socket.onerror = (error) => {
                console.error("Error en WebSocket:", error);
            };

            let send = document.getElementById("btnSendMessage");
            send.onclick = () => this.sendMessage(socket);
            const messageInput = document.getElementById("messageInput");
            messageInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.sendMessage(socket);
                }
            });
        });
    }

    sendMessage(socket) {
        const messageInput = document.getElementById("messageInput");
        if (messageInput.value.trim() === "") {
            return;
        } else {
            const fullMessage = {
                type: "message",
                message: messageInput.value
            };
            const jsonString = JSON.stringify(fullMessage);
            let messageArea = document.getElementById("conversation");
            messageArea.innerHTML += '<div class="container-userMessage"><div class="userMessage">' + messageInput.value + '</div></div><br>';
            socket.send(jsonString);
            messageInput.value = '';
            messageArea.scrollTop = messageArea.scrollHeight;
        }
    }

    addEventListeners() {
        const questions = [
            { id: 'pregunta1', question: '¿Qué es Campuslands?' },
            { id: 'pregunta2', question: '¿Dónde están ubicados?' },
            { id: 'pregunta3', question: '¿Cuáles son los requisitos para ser parte de Campuslands?' },
            { id: 'pregunta4', question: '¿Cuánto cuesta ingresar?' },
            { id: 'pregunta5', question: '¿Cómo es el plan académico?' },
            { id: 'pregunta6', question: '¿Qué oportunidades laborales hay?' }
        ];
        questions.forEach(q => {
            document.getElementById(q.id).addEventListener('click', () => this.handleQuestionClick(q.id));
        });
    }

    handleQuestionClick(questionId) {
        const respuestas = {
            pregunta1: "Campuslands es una experiencia educativa intensiva de un año 📚🚀 que forma a jóvenes en tecnología 💻, inglés 🌎 y habilidades blandas 🤝, preparándolos para empleos bien remunerados 💰. Es 100% presencial 🏫 y acelera la inserción laboral rápidamente ⏩.",
            pregunta2: "Campuslands se encuentra en la Zona Franca de Santander 🏢, en el moderno edificio Zenith, piso 6, sobre el Anillo Vial que conecta Girón con Floridablanca, Colombia 🌍. Es un lugar estratégico y de fácil acceso 🚗✨.",
            pregunta3: "Para ingresar a Campuslands necesitas tener entre 17 y 32 años, disponibilidad de 8-10 horas diarias para asistir presencialmente de lunes a viernes, y, sobre todo, actitud positiva, lógica y disciplina 💪📚. Si tienes estas cualidades, estás listo para vivir la experiencia transformadora que te llevará al éxito 🚀✨.",
            pregunta4: "El programa de Campuslands tiene una inversión de 20 millones de pesos 💰, pero no te preocupes, porque contamos con becas que cubren entre el 50% y el 100% 🎓✨, además de opciones de financiamiento para que nada te detenga en tu camino hacia un futuro en tecnología 🚀💻.",
            pregunta5: "El plan académico de Campuslands dura un año e incluye programación avanzada 💻, inglés 🌎 y habilidades blandas 🤝 para prepararte para el mercado laboral. Los horarios son intensivos y puedes elegir entre la jornada matutina de 6:00 a.m. a 3:00 p.m. ⏰🌅 o la vespertina de 2:00 p.m. a 10:00-11:00 p.m. 🌆🌙. ¡Prepárate para un año transformador! 🚀✨.",
            pregunta6: "Al graduarte de Campuslands, tendrás oportunidades laborales como desarrollador de software 💻, analista de datos 📊, soporte técnico 🛠️, entre otros roles demandados en tecnología. Estas posiciones ofrecen buenas remuneraciones y prometen un crecimiento profesional en un sector en constante expansión 🚀​."
        };
        const respuesta = respuestas[questionId];
        const answerContainer = document.getElementById("conversation");
        if (answerContainer) {
            answerContainer.innerHTML += `<div class="container-iaMessage"><div class="iaMessage"><strong></strong> ${respuesta}</div></div><br>`; 
            answerContainer.scrollTop = answerContainer.scrollHeight;
        }

        const button = document.getElementById(questionId);
        if (button) {
            button.style.display = "none"; 
        }

        const allButtonsHidden = Array.from(document.querySelectorAll(".faq-button")).every(button => button.style.display === "none");
        if (allButtonsHidden) {
            const faqTitle = document.getElementById("faqTitle");
            if (faqTitle) {
                faqTitle.style.display = "none"; // Oculta el título cuando todos los botones están ocultos
            }
        }
    }
}

customElements.define("general-chat", GeneralChat);
