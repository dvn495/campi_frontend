import { authData, getData, getElementData, postData } from "../../../API/API.js";

const userInputPhone = document.getElementById("telefono");
const UserName = document.getElementById("nombreUsuario");
const userDataForm = document.getElementById("loginForm");

let userPhone = '';

console.log("userPhone:", userPhone);

const endpointFind = "user/phone";
const endpointLogin = "auth/login";
const endpointRegister = "auth/register";

const btnEnterChat = document.getElementById("ingresarBtn");

btnEnterChat.addEventListener("click", async e => {
    e.preventDefault();

    if (userInputPhone && iti) {
        userPhone = `${iti.getSelectedCountryData().dialCode}${userInputPhone.value}`;
    }

    console.log("userPhone:", userPhone);

    let datos = Object.fromEntries(new FormData(userDataForm).entries());
    datos.id = 0;
    datos.username = UserName.value;
    datos.telefono = userPhone;
    datos.role = "USER";

    try {
        // Si el registro falla, intenta iniciar sesión
        try {
            console.log('Intentando iniciar sesión...');
            const responseLogin = await authData(datos, endpointLogin);
            if (responseLogin.ok) {
                console.log('Login exitoso! Redirigiendo...');
                const data = await responseLogin.json();
                localStorage.setItem('authToken', data.token);
                window.location.href = '/View/chat.html';
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
                window.location.href = '/View/chat.html';
                return; // Termina la función después de registrar
            }
        } catch (registerError) {
            console.warn('Error en el registro:', registerError);
        }

        
    } catch (error) {
        console.error('Error durante el proceso general:', error);
    }
});