import { authData, setUsername } from "../../../API/API.js";

const userInputPhone = document.getElementById("telefono");
const userName = document.getElementById("nombreUsuario");
const userDataForm = document.getElementById("loginForm");
const userCity = document.getElementById("ciudad");
const btnEnterChat = document.getElementById("ingresarBtn");

let userPhone = "";
console.log("userPhone:", userPhone);

const endpointLogin = "auth/login";
const endpointRegister = "auth/register";

const adminButton = document.getElementById("adminButton");
adminButton.onclick = () => {
  window.location.href = "/View/admin.html"; // Redirige a la página de administración
};

// Escucha el botón de ingreso
btnEnterChat.addEventListener("click", async (e) => {
  e.preventDefault();

  const isValid = validateForm();
  if (!isValid) return;

  if (userInputPhone && iti) {
    userPhone = `${iti.getSelectedCountryData().dialCode}${
      userInputPhone.value
    }`;
  }

  if (!validarTelefono(userPhone)) {
    alert("El numero de telefono debe tener 10 caracteres");
    return;
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
  datos.city = userCity.value;
  datos.role = "USER";

  console.log(datos);

  localStorage.setItem("userName", userName.value);

  try {
    console.log("Intentando iniciar sesión...");
    const responseLogin = await authData(datos, endpointLogin);
    if (responseLogin.ok) {
      console.log("Login exitoso! Redirigiendo...");
      const data = await responseLogin.json();
      localStorage.setItem("authToken", data.token);
      redirectToCity(userCity.value);
    } else {
      console.error("Error en el login:", await responseLogin.text());
    }
  } catch (loginError) {
    console.error("Error durante el login:", loginError);
    try {
      const responseCreate = await authData(datos, endpointRegister);
      if (responseCreate.ok) {
        console.log("Usuario registrado con éxito! Redirigiendo...");
        const userData = await responseCreate.json();
        localStorage.setItem("authToken", userData.token);
        redirectToCity(userCity.value);
        return;
      }
    } catch (registerError) {
      console.warn("Error en el registro:", registerError);
    }
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
async function setUserName(endpoint) {
  const endpointUsername = endpoint;
  try {
    const responseUsername = await setUsername(endpointUsername);
    if (responseUsername.ok) {
      console.log("Usuario enviado con éxito! Redirigiendo...");
      return;
    }
  } catch (usernameError) {
    console.warn("Error en el registro:", usernameError);
  }
}

function redirectToCity(city) {
  const Bucaramanga = "/View/chat.html";
  const Bogota = "/View/chatBogota.html";

  if (city === "Bucaramanga") {
    const endpoint = "https://chatcampuslands.com:8443/chatbot/user/username";
    setUserName(endpoint);
    window.location.href = Bucaramanga; // Cambiar ruta si es necesario
  } else if (city === "Bogota") {
    const endpoint =
      "https://chatcampuslands.com:8443/chatbotbogota/user/username";
    setUserName(endpoint);
    window.location.href = Bogota; // Cambiar ruta si es necesario
  } else {
    alert("Ciudad no reconocida. Por favor selecciona una opción válida.");
  }
}

function validarTelefono(numero) {
  // Función mejorada para normalizar teléfonos
  const normalizarTelefono = (telefono) => {
    if (!telefono) return null;

    // Convertir a string y eliminar todo lo que no sea número
    let numeroLimpio = telefono.toString().replace(/\D/g, "");

    // Si comienza con 57, remover el prefijo
    if (numeroLimpio.startsWith("57")) {
      numeroLimpio = numeroLimpio.substring(2);
    }

    // Asegurarse de que tengamos un número de 10 dígitos que comience con 3
    if (numeroLimpio.length === 10 && numeroLimpio.startsWith("3")) {
      return numeroLimpio;
    }

    console.log(
      "Número no normalizado:",
      telefono,
      "-> resultado:",
      numeroLimpio
    );
    return null;
  };

  // Invocación de normalizarTelefono
  return normalizarTelefono(numero);
}
