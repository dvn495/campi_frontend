import { postData } from "../../../API/API.js";

export class BogotaChat extends HTMLElement {
  constructor() {
    super();
    this.render();
    this.webSocket();
    this.addEventListeners();
    this.dropdown();
  }

  render() {
    this.innerHTML = /* html */ `
        <section class="container-box">
            
            <div class="container-chat">
            
                <div class="container-chat_conversation">
                    <!-- Modal de preguntas frecuentes -->
                    <div id="faqModal" class="modal" style="display: none;" >
                        <div class="modal-content">
                            <span id="closeModal" class="close">&times;</span>
                            <div id="questions-container">
                                <button class="faq-button-question" id="pregunta1">¿Qué es EAN Campuslands?</button>
                                <button class="faq-button-question" id="pregunta2">¿Dónde están ubicados?</button>
                                <button class="faq-button-question" id="pregunta3">¿Cuáles son los requisitos para ser parte de EAN Campuslands?</button>
                                <button class="faq-button-question" id="pregunta4">¿Cuánto cuesta ingresar?</button>
                                <button class="faq-button-question" id="pregunta5">¿Cómo es el plan académico?</button>
                                <button class="faq-button-question" id="pregunta6">¿Qué oportunidades laborales hay?</button>
                            </div>
                        </div>
                    </div>
                    <!-- Botón para abrir el modal de preguntas frecuentes -->
                    <div class="container-inscription-button">
                            <a href="https://miniurl.cl/RegistroCampuslands" target="_blank" class="btnInscription">
                                ¡¡Inscríbete ahora!!
                            </a>
                            <button id="faqButton" class="faq-button">Preguntas frecuentes</button>
                    </div>
                    <br>
                    <div id="conversation" class="container-answers"> 
                        
                        <br class="br_questions">
            
                        <br>
                        <div class="container-welcome">
                            <div class="container-img">
                                <img class="img-EAN" src="/img/eanCampuslands.jpg">
                            </div>
                            <br>
                            <div class="welcome-text">
                                ¡Hola y bienvenid@ a tu chat con EAN Campuslands! Soy Isa, y estoy aquí para ayudarte a resolver todas tus dudas sobre Campuslands.
                            </div>
                        </div>
                        
                        <br>
                        <div class="warning_time">¡Isa puede estár ocupada un momentito! 😊⏳ Dame unos segundos y vuelvo contigo con toda la energía. 🚀✨</div>
                        <br>
                    </div>
                    <div id="waitingButton" class="waiting-button" style="display: none;">
                        <box-icon class="dot" type='solid' name='circle'></box-icon>
                        <box-icon class="dot" type='solid' name='circle'></box-icon>
                        <box-icon class="dot" type='solid' name='circle'></box-icon>
                    </div>

                </div>  


                <div id="message" class="container-chat_message">
                    <div class="messageToSend">
                        <input type="text" class="input-text" name="nombre" id="messageInput" placeholder=" Escribe un mensaje">  
                    </div>
                    <div class="send-button">
                        <button id="btnSendMessage"><box-icon name='send' type='solid' color='#17345a' ></box-icon></button>
                    </div>
                </div>
            </div>
            <div class="dropdownWrapper" id="dropdownWrapper">
              <box-icon name='message-rounded-dots' type='solid' ></box-icon>
            </div>
            <ul class="wrapper hidden" id="dropdownList">
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
                    <a href="https://wa.me/573248618037" target="_blank">
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
  configureMarkdown() {
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false,
      highlight: function (code, lang) {
        return code;
      },
    });
  }

  renderMarkdownMessage(container, message) {
    container.innerHTML += `<div class="container-iaMessage"><div class="iaMessage">${marked.parse(
      message
    )}</div></div><br>`;
  }

  webSocket() {
    let socket;
    document.addEventListener("DOMContentLoaded", () => {
      socket = new WebSocket(
        "wss://chatcampuslands.com:8443/chatbotbogota/chatBogota"
      );
      socket.onopen = () => {
        console.log("Conexión WebSocket establecida.");
      };

      function showWaitingDots() {
        const waitingDots = document.getElementById("waitingButton");
        waitingDots.style.display = "flex"; // Asegúrate de que el contenedor esté visible
      }

      function stopWaitingDots() {
        const waitingDots = document.getElementById("waitingButton");
        waitingDots.style.display = "none"; // Oculta el contenedor
      }

      let messageCount = 0;
      socket.onmessage = (event) => {
        let messageArea = document.getElementById("conversation");
        if (messageArea) {
          this.renderMarkdownMessage(messageArea, event.data);
          messageArea.scrollTop = messageArea.scrollHeight;
          stopWaitingDots();

          messageCount++;
          if (messageCount === 1) {
            document.getElementById("messageInput").disabled = true;
            document.getElementById("btnSendMessage").disabled = true;
            messageArea.innerHTML += `
                            <div class="container-iaMessage campuslands-promo">
                                <div class="iaMessage promo-message">
                                        <p style="margin-top: 0;">🎉 Nos encantaría conocerte un poco más </p>
                                        <p> ¿Que edad tienes?</p>
                                        <div class="input-group">
                                            <input type="number" id="campuslands-age" placeholder="Tu edad" class="age-input" min="1" max="99">
                                        </div>
                                        <p>¿Te animas a dedicar 8 horas diarias de manera presencial durante 10 meses? 😊</p>
                                        <div class="call-promo">
                                            <div class="call-promo__contact left">
                                                <button class="availability-response btnContactPromo" value="si">Sí</button>
                                            </div>
                                            <div class="call-promo__contact right">
                                                <button class="availability-response btnContactPromo" value="no">No</button>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <br>
                            <div class="container-iaMessage campuslands-promo">
                              <div class="iaMessage promo-message">
                                <p> 🚨⚠️ Por favor, selecciona una opción para que podamos continuar conversando. ⚠️🚨</p>
                              </div>
                            </div>   
                            `;
            messageArea.scrollTop = messageArea.scrollHeight;
            this.addAgeAndAviability();
          }
          if (messageCount === 8) {
            messageArea.innerHTML += `
                            <div class="container-iaMessage campuslands-promo">
                                <div class="iaMessage promo-message">
                                    ¿Quieres que te contactemos? Si es asi indicanos de que forma:
                                    <div class="call-promo">
                                        <div class="call-promo__contact left">
                                            <button class="btnContactPromo" value="mensaje">Mensaje</button>
                                        </div>
                                        <div class="call-promo__contact right">
                                            <button class="btnContactPromo" value="llamada">Llamada</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
            messageArea.scrollTop = messageArea.scrollHeight;
            this.addCallOrMessage();
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
      send.onclick = () => {
        showWaitingDots();
        this.sendMessage(socket);
      };
      const messageInput = document.getElementById("messageInput");
      messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          showWaitingDots();
          this.sendMessage(socket);
        }
      });
    });
  }

  sendMessage(socket) {
    const endpoint = "messages/add";
    const userName = localStorage.getItem("userName");
    const messageInput = document.getElementById("messageInput");
    if (messageInput.value.trim() === "") {
      return;
    } else {
      const fullMessage = {
        type: "message",
        message:  `Mi nombre es: ${userName} y mi pregunta es: ${messageInput.value}`
      };
      const jsonString = JSON.stringify(fullMessage);
      let messageArea = document.getElementById("conversation");
      const userMessageInput = messageInput.value;
      messageArea.innerHTML +=
        '<div class="container-userMessage"><div class="userMessage">' +
        userMessageInput +
        "</div></div><br>";
      socket.send(jsonString);
      console.log(userMessageInput);
      postData(userMessageInput, endpoint);
      messageInput.value = "";
      messageArea.scrollTop = messageArea.scrollHeight;
    }
  }
  dropdown() {
    document.addEventListener("DOMContentLoaded", () => {
      const dropdownBtn = document.getElementById("dropdownWrapper");
      const dropdownList = document.getElementById("dropdownList");
      
      function openDropdown() {
        dropdownList.classList.add("active");
        dropdownBtn.classList.add("hidden");
      }
      
      function closeDropdown() {
        dropdownList.classList.remove("active");
        dropdownBtn.classList.remove("hidden");
      }
      
      dropdownBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        if (dropdownList.classList.contains("active")) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      window.addEventListener("click", (event) => {
        if (!dropdownList.contains(event.target) && !dropdownBtn.contains(event.target)) {
          closeDropdown();
        }
      });
      
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeDropdown();
        }
      });
    });
  }

  addEventListeners() {
    const faqButton = document.getElementById("faqButton");

    const closeModal = document.getElementById("closeModal");

    // Abre el modal cuando se hace clic en el botón de preguntas frecuentes
    faqButton.onclick = () => {
      const faqModal = document.getElementById("faqModal");
      faqModal.style.display = "block";
    };

    // Cierra el modal cuando se hace clic en la "x"
    closeModal.onclick = () => {
      const faqModal = document.getElementById("faqModal");
      faqModal.style.display = "none";
    };

    // Cierra el modal cuando se hace clic fuera del contenido del modal
    window.onclick = (event) => {
      const faqModal = document.getElementById("faqModal");
      if (event.target == faqModal) {
        faqModal.style.display = "none";
      }
    };

    // Asigna eventos a las preguntas frecuentes
    const questions = [
      { id: "pregunta1", question: "¿Qué es EAN Campuslands?" },
      { id: "pregunta2", question: "¿Dónde están ubicados?" },
      {
        id: "pregunta3",
        question: "¿Cuáles son los requisitos para ser parte de EAN Campuslands?",
      },
      { id: "pregunta4", question: "¿Cuánto cuesta ingresar?" },
      { id: "pregunta5", question: "¿Cómo es el plan académico?" },
      { id: "pregunta6", question: "¿Qué oportunidades laborales hay?" },
    ];

    questions.forEach((q) => {
      const button = document.getElementById(q.id);
      button.addEventListener("click", () => this.handleQuestionClick(q.id));
    });
  }

  handleQuestionClick(questionId) {
    const respuestas = {
      pregunta1:
        "EAN Campuslands es una experiencia educativa intensiva de un año 📚🚀 que forma a jóvenes en tecnología 💻, inglés 🌎 y habilidades blandas 🤝, preparándolos para empleos bien remunerados 💰. Es 100% presencial 🏫 y acelera la inserción laboral rápidamente ⏩.",
      pregunta2:
        "EAN Campuslands se encuentra en la Universidad EAN, calle 71 #9-84, Colombia 🌍. Es un lugar estratégico y de fácil acceso 🚗✨.",
      pregunta3:
        "Para ingresar a EAN Campuslands necesitas tener entre 17 y 32 años, disponibilidad de 8-10 horas diarias para asistir presencialmente de lunes a viernes, y, sobre todo, actitud positiva, lógica y disciplina 💪📚. Si tienes estas cualidades, estás listo para vivir la experiencia transformadora que te llevará al éxito 🚀✨.",
      pregunta4:
        "El programa de EAN Campuslands tiene una inversión de 20 millones de pesos 💰, pero no te preocupes, porque contamos con becas que cubren entre el 50% y el 100% 🎓✨, además de opciones de financiamiento para que nada te detenga en tu camino hacia un futuro en tecnología 🚀💻.",
      pregunta5:
        "El plan académico de EAN Campuslands dura un año e incluye programación avanzada 💻, inglés 🌎 y habilidades blandas 🤝 para prepararte para el mercado laboral. Los horarios son intensivos y puedes elegir entre la jornada matutina de 6:00 a.m. a 3:00 p.m. ⏰🌅 o la vespertina de 2:00 p.m. a 10:00-11:00 p.m. 🌆🌙. ¡Prepárate para un año transformador! 🚀✨.",
      pregunta6:
        "Al graduarte de EAN Campuslands, tendrás oportunidades laborales como desarrollador de software 💻, analista de datos 📊, soporte técnico 🛠️, entre otros roles demandados en tecnología. Estas posiciones ofrecen buenas remuneraciones y prometen un crecimiento profesional en un sector en constante expansión 🚀​.",
    };

    const respuesta = respuestas[questionId];
    const answerContainer = document.getElementById("conversation");
    if (answerContainer) {
      answerContainer.innerHTML += `<div class="container-iaMessage"><div class="iaMessage"><strong></strong> ${respuesta}</div></div><br>`;
      answerContainer.innerHTML += `
                            <div class="container-iaMessage"><div class="iaMessage">
                            ¡Inscríbete en EAN Campuslands y transforma tu vida en solo un año! 🚀 Aprende tecnología, inglés y habilidades clave para destacar en el mercado laboral.
                            <br>Regístrate aquí: <a href="https://miniurl.cl/RegistroCampuslands" target="_blank">Inscripción a EAN Campuslands</a>
                            <br>¡Cupos limitados, no te quedes fuera!
                            </div></div><br>
                            `;
      answerContainer.scrollTop = answerContainer.scrollHeight;
    }

    const button = document.getElementById(questionId);
    if (button) {
      button.disabled = true;
      button.style.opacity = "0.5";
    }
  }

  addAgeAndAviability() {
    const btnConfirmAgeAndAv = document.getElementById("confirm-ageBtn");
    const camperAge = document.getElementById("campuslands-age");

    // Manejar el clic en los botones de disponibilidad
    document.querySelectorAll(".availability-response").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        // Remover la clase "selected" de todos los botones
        document.querySelectorAll(".availability-response").forEach((btn) => {
          btn.classList.remove("selected");
        });

        // Agregar la clase "selected" al botón clicado
        button.classList.add("selected");
        console.log("Botón seleccionado:", button.value);
        const selectedButton = document.querySelector(
          ".availability-response.selected"
        );

        if (!selectedButton) {
          alert("Por favor, selecciona una disponibilidad antes de confirmar.");
          return;
        }

        const availabilityValue = selectedButton.value;
        console.log(
          "Disponibilidad seleccionada al confirmar:",
          availabilityValue
        );

        // Validar la edad ingresada
        const ageInput = camperAge.value;

        if (!ageInput || isNaN(ageInput) || ageInput <= 0) {
          alert("Por favor, introduce una edad válida.");
          return;
        }

        // Preparar los datos para enviar
        const datosAge = { age: parseInt(ageInput, 10) };
        const datosAv = { availability: availabilityValue };

        try {
          const responseAge = await postData(datosAge, "user/age");
          if (responseAge.ok) {
            console.log("Edad enviada con éxito");
          } else {
            console.error("Error al enviar la edad:", await responseAge.text());
          }
        } catch (error) {
          console.error("Error en la solicitud de edad:", error);
        }

        try {
          const responseAv = await postData(datosAv, "user/availability");
          if (responseAv.ok) {
            console.log("Disponibilidad enviada con éxito");
          } else {
            console.error(
              "Error al enviar la disponibilidad:",
              await responseAv.text()
            );
          }
        } catch (error) {
          console.error("Error en la solicitud de disponibilidad:", error);
        }
        document.getElementById("messageInput").disabled = false;
        document.getElementById("btnSendMessage").disabled = false;

        let messageArea = document.getElementById("conversation");
        if (messageArea) {
          messageArea.innerHTML +=
            '<br><div class="container-iaMessage"><div class="iaMessage">¡Gracias por tu respuesta! 🚀✨ ¿En qué más puedo ayudarte? 🌟</div></div><br>';
          messageArea.scrollTop = messageArea.scrollHeight;
        }
      });
    });
  }

  addCallOrMessage() {
    // Ensure buttons are selected correctly using the class selector
    document.querySelectorAll(".btnContactPromo").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();

        // Remove the "selected" class from all buttons
        document.querySelectorAll(".btnContactPromo").forEach((btn) => {
          btn.classList.remove("selected");
        });

        // Add the "selected" class to the clicked button
        button.classList.add("selected");
        console.log("Button selected:", button.value);

        // Get the selected button
        const selectedButton = document.querySelector(
          ".btnContactPromo.selected"
        );
        if (!selectedButton) {
          alert(
            "Por favor, selecciona una forma de contacto antes de continuar."
          );
          return;
        }

        const contactValue = selectedButton.value;
        console.log("Selected contact method:", contactValue);

        // Prepare data to send
        const contactData = { contact_way: contactValue };

        // Send data to the API
        try {
          const response = await postData(contactData, "user/contact");
          if (response.ok) {
            console.log("Contact method sent successfully");
          } else {
            console.error(
              "Error sending contact method:",
              await response.text()
            );
          }
        } catch (error) {
          console.error("Error in contact method request:", error);
        }
        let messageArea = document.getElementById("conversation");
        if (contactValue === "llamada") {
          // Display confirmation message

          if (messageArea) {
            messageArea.innerHTML += `
                            <br>
                            <div class="container-iaMessage">
                                <div class="iaMessage">
                                    ¡Gracias por tu interés en EAN Campuslands! 📞✨ Pronto uno de nuestros asesores se pondrá en contacto contigo vía telefónica para resolver tus dudas y acompañarte en este proceso. 
                                    ¡Prepárate para esta llamada, será el inicio de algo increíble! 🚀
                                </div>
                            </div>
                            <br>`;
            messageArea.scrollTop = messageArea.scrollHeight;
          }
        } else if (contactValue === "mensaje") {
          if (messageArea) {
            const nombreUsuario = localStorage.getItem("nombreUsuario");

            if (!nombreUsuario) {
              nombreUsuario = "Usuario"; // Or use a placeholder like "Usuario desconocido"
            }

            // Properly encode the message for URL usage
            const whatsappText = encodeURIComponent(`
                            ¡Hola! Mi nombre es: ${nombreUsuario}. Estoy interesado en conocer más sobre EAN Campuslands, su modelo educativo y cómo puedo ser parte de esta experiencia transformadora. 😊
                        `);

            messageArea.innerHTML += `
                            <br>
                            <div class="container-iaMessage">
                                <div class="iaMessage">
                                    Gracias por escribirnos! ✉️✨ En breve, recibirás un mensaje con toda la información que necesitas para iniciar tu camino en Campuslands.  
                                    Si tienes más preguntas, no dudes en responder. ¡Estamos aquí para ayudarte en cada paso! 🌟  
                                    
                                    <a href="https://wa.me/573248618037?text=${whatsappText}" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        class="whatsapp-link">
                                        Chatea con nosotros en WhatsApp 📱✨
                                    </a>
                                    
                                </div>
                            </div>
                            <br>`;
            messageArea.scrollTop = messageArea.scrollHeight;
          }
        }
      });
    });
  }
}

customElements.define("bogota-chat", BogotaChat);
