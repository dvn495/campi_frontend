import { authData, getData, getElementData, postData } from "../../../API/API.js";

const userInputPhone = document.getElementById("telefono");
const userName = document.getElementById("nombreUsuario");
const userDataForm = document.getElementById("loginForm");
const userCity = document.getElementById("ciudad");
const btnEnterChat = document.getElementById("ingresarBtn");

let userPhone = '';
console.log("userPhone:", userPhone);

const endpointLogin = "auth/login";
const endpointRegister = "auth/register";

// Escucha el botón de ingreso
btnEnterChat.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
        btnEnterChat.disabled = true; // Prevent double submission
        
        // Prepare user data
        const datos = {
            id: 0,
            username: userName.value.trim(),
            telefono: userInputPhone && iti ? 
                `${iti.getSelectedCountryData().dialCode}${userInputPhone.value}` : '',
            role: "USER"
        };

        // First try login
        console.log('Intentando iniciar sesión...');
        const loginResponse = await authData(datos, endpointLogin);
        
        if (loginResponse.ok) {
            const data = await loginResponse.json();
            localStorage.setItem('authToken', data.token);
            await setupWebSocketConnection(userCity.value);
            return;
        }

        // If login fails, try registration
        console.log('Usuario no encontrado, intentando registro...');
        const registerResponse = await authData(datos, endpointRegister);

        if (registerResponse.ok) {
            const data = await registerResponse.json();
            localStorage.setItem('authToken', data.token);
            await setupWebSocketConnection(userCity.value);
            return;
        }

        // Handle errors
        if (registerResponse.status === 409) {
            alert("Este usuario ya existe. Por favor, intenta con otro nombre de usuario.");
        } else {
            alert("Hubo un error durante el proceso. Por favor, intenta nuevamente.");
        }

    } catch (error) {
        console.error('Error:', error);
        alert("Error de conexión. Por favor, verifica tu conexión e intenta nuevamente.");
    } finally {
        btnEnterChat.disabled = false;
    }
});

async function setupWebSocketConnection(city) {
    try {
        // First establish WebSocket connection
        const wsUrl = `wss://chatcampuslands.com:8443/chatbot/chat?city=${encodeURIComponent(city)}`;
        const ws = new WebSocket(wsUrl);
        
        await new Promise((resolve, reject) => {
            ws.onopen = () => {
                console.log('WebSocket conectado exitosamente');
                resolve();
            };
            
            ws.onerror = (error) => {
                console.error('Error de WebSocket:', error);
                reject(error);
            };

            // Set timeout for connection attempt
            setTimeout(() => reject(new Error('Timeout connecting to WebSocket')), 5000);
        });

        // Only redirect after successful WebSocket connection
        const routes = {
            "Bucaramanga": '/View/chat.html',
            "Bogota": '/View/chatBogota.html'
        };

        const route = routes[city];
        if (route) {
            window.location.href = route;
        } else {
            throw new Error("Ciudad no reconocida");
        }

    } catch (error) {
        console.error('Error estableciendo conexión:', error);
        alert("Error conectando al chat. Por favor, intenta nuevamente.");
        throw error;
    }
}

// Valida el formulario antes de proceder
function validateForm() {
    if (!userName.value || !userInputPhone.value || !userCity.value) {
        alert("Por favor, completa todos los campos requeridos.");
        return false;
    }
    return true;
}

