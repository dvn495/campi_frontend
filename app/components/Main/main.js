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
    
    const isValid = validateForm();
    if (!isValid) return;

    if (userInputPhone && iti) {
        userPhone = `${iti.getSelectedCountryData().dialCode}${userInputPhone.value}`;
    }

    if (!userName.value || !userPhone || !userCity.value) {
        console.error("Por favor, completa todos los campos requeridos.");
        alert("Todos los campos son obligatorios.");
        return;
    }

    let datos = Object.fromEntries(new FormData(userDataForm).entries());
    datos.id = 0;
    datos.username = userName.value;
    datos.telefono = userPhone;
    datos.role = "USER";


    try {
        console.log('Intentando iniciar sesión...');
        const responseLogin = await authData(datos, endpointLogin);
        if (responseLogin.ok) {
            console.log('Login exitoso! Redirigiendo...');
            const data = await responseLogin.json();
            localStorage.setItem('authToken', data.token);
            redirectToCity(userCity.value);
        } else {
            console.error('Error en el login:', await responseLogin.text());
        }
    } catch (loginError) {
        console.error('Error durante el login:', loginError);
    }
    // Intenta registrar al usuario primero
    try {
        const responseCreate = await authData(datos, endpointRegister);
        if (responseCreate.ok) {
            console.log('Usuario registrado con éxito! Redirigiendo...');
            const userData = await responseCreate.json();
            localStorage.setItem('authToken', userData.token);
            redirectToCity(userCity.value);
            return; // Termina la función después de registrar
        }
    } catch (registerError) {
        console.warn('Error en el registro:', registerError);
    }

});

// Valida el formulario antes de proceder
function validateForm() {
    if (!userName.value || !userInputPhone.value || !userCity.value) {
        alert("Por favor, completa todos los campos requeridos.");
        return false;
    }
    return true;
}
function redirectToCity(city) {
    const Bucaramanga = '/View/chat.html';
    const Bogota = '/View/chatBogota.html';


    if (city === "Bucaramanga") {
        window.location.href = Bucaramanga; // Cambiar ruta si es necesario
    } else if (city === "Bogota") {
        window.location.href = Bogota; // Cambiar ruta si es necesario
    } else {
        alert("Ciudad no reconocida. Por favor selecciona una opción válida.");
    }
}