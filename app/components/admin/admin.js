import { getData, getDataLanding, authData } from "../../../API/API.js"; // Ruta relativa de tu archivo API

document.addEventListener("DOMContentLoaded", () => {
  const submitPasswordButton = document.getElementById("submitPassword");
  const passwordInput = document.getElementById("adminPassword");
  const dataTableContainer = document.getElementById("dataTableContainer");
  const userTableContainer = document.getElementById("dataUserContainer");
  const containerAnswersData = document.getElementById(
    "container-answersUsers"
  );
  const errorMessage = document.getElementById("errorMessage");
  const btnXlsx = document.querySelector("#btnXlsx");
  const btnXls = document.querySelector("#btnXls");
  const btnCsv = document.querySelector("#btnCsv");
  const btnXlsxLanding = document.querySelector("#btnXlsxLanding");
  const btnXlsLanding = document.querySelector("#btnXlsLanding");
  const btnCsvLanding = document.querySelector("#btnCsvLanding");
  const startDate = document.getElementById("startDate");
  const endDate = document.getElementById("endDate");
  const submitDateRange = document.getElementById("submitDateRange");
  const userCity = document.getElementById("ciudad");
  const landingInformButton = document.getElementById("landingInform");
  const containerLanding = document.getElementById("container-landing");
  const landingTableContainer = document.getElementById(
    "landingTableContainer"
  );
  const returnToMainButton = document.getElementById("returnToMainButton");

  let ADMIN_PASSWORD;

  let datos = {};

  // Inicializa la contraseña después de cargar el DOM
  fetchPassword().then((password) => {
    ADMIN_PASSWORD = password;
  });

  // Evento al hacer clic en el botón "Submit"
  submitPasswordButton.addEventListener("click", async () => {
    const enteredPassword = passwordInput.value;

    const endpointLogin = "auth/login";

    datos.id = 0;
    datos.username = enteredPassword;                         datos.telefono = 111906;
    datos.role = "ADMIN";

    try {
      console.log("Intentando iniciar sesión...");
      const responseLogin = await authData(datos, endpointLogin);
      if (responseLogin.ok) {
        console.log("Login exitoso! Redirigiendo...");
        const data = await responseLogin.json();
        localStorage.setItem("authToken", data.token);
      } else {
        console.error("Error en el login:", await responseLogin.text());
        return;
      }
    } catch (loginError) {
      console.error("Error durante el login:", loginError);
      return;
    }

    if (enteredPassword === ADMIN_PASSWORD) {
      errorMessage.style.display = "none"; // Oculta el mensaje de error
      // dataTableContainer.style.display = 'block'; // Muestra la tabla
      // userTableContainer.style.display= 'block';
      containerAnswersData.style.display = "block";
      passwordInput.style.display = "none";
      submitPasswordButton.style.display = "none";
      btnXlsx.onclick = () => {
        exportData("xlsx", dataTableContainer, dataUserContainer);
      };
      btnXls.onclick = () => {
        exportData("xls", dataTableContainer, dataUserContainer);
      };
      btnCsv.onclick = () => {
        exportData("cvs", dataTableContainer, dataUserContainer);
      };
      btnXlsxLanding.onclick = () => {
        exportLandingData("xlsx");
      };

      btnXlsLanding.onclick = () => {
        exportLandingData("xls");
      };

      btnCsvLanding.onclick = () => {
        exportLandingData("csv");
      };
    } else {
      errorMessage.style.display = "block"; // Muestra el mensaje de error
    }
  });

  landingInformButton.addEventListener("click", async () => {
    // Hide the main container and show landing container
    containerAnswersData.style.display = "none";
    containerLanding.style.display = "block";

    try {
      // Fetch landing data immediately when switching to this view
      await fetchLandingData();
      landingTableContainer.style.display = "block";
    } catch (error) {
      console.error("Error fetching landing data:", error);
    }
  });

  submitDateRange.addEventListener("click", async () => {
    const enteredStartDate = startDate.value;
    const enteredEndDate = endDate.value;
    const enteredCity = userCity.value;

    if (!enteredEndDate || !enteredStartDate || !enteredCity) {
      console.error("Por favor, completa todos los campos requeridos.");
      alert("Todos los campos son obligatorios.");
      return;
    }

    if (!enteredStartDate || !enteredEndDate || !enteredCity) {
      alert("Por favor selecciona un rango de fechas válido.");
      return;
    }

    try {
      // Obtener datos basados en el rango de fechas seleccionado
      await fetchDataByDateRange(enteredStartDate, enteredEndDate, enteredCity);
      await fetchUserDataByDateRange(
        enteredStartDate,
        enteredEndDate,
        enteredCity
      );
      dataTableContainer.style.display = "block"; // Muestra la tabla
      userTableContainer.style.display = "block";
    } catch (error) {
      console.error("Error al consultar datos:", error);
    }
  });
});

async function fetchPassword() {
  const passwordEndpoint = "password/get";

  try {
    const { data, error } = await getData(passwordEndpoint);

    if (error || !data) {
      console.error("Error fetching data:", error);
      return null; // Devuelve null si hay un error
    }

    return data.password; // Retorna la contraseña
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Devuelve null en caso de error
  }
}

async function fetchDataByDateRange(startDate, endDate, city) {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = ""; // Limpia cualquier dato existente

  try {
    // Llama al API para obtener datos
    const { data, error } = await getData(
      `admin/messages/today?start=${startDate}&end=${endDate}&city=${city}`
    );

    if (error || !data) {
      console.error("Error fetching data:", error);
      return;
    }

    // Itera sobre los datos y crea las filas dinámicamente
    data.forEach((message) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${message.userId}</td>
                <td>${message.content}</td>
                <td>${message.messageId}</td>
                <td>${message.messageTime}</td>
            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching today data:", error);
  }
}

async function fetchUserDataByDateRange(startDate, endDate, city) {
  const tableBody = document.querySelector("#userTable tbody");
  tableBody.innerHTML = ""; // Limpia cualquier dato existente

  try {
    // Llama al API para obtener datos
    const { data, error } = await getData(
      `admin/users/today?start=${startDate}&end=${endDate}&city=${city}`
    );

    if (error || !data) {
      console.error("Error fetching data:", error);
      return;
    }

    // Itera sobre los datos y crea las filas dinámicamente
    data.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.telefono}</td>
                <td>${user.age}</td>
                <td>${user.availability}</td>
                <td>${user.contact_way}</td>
            `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching today data:", error);
  }
}

function exportData(type, dataTableContainer, dataUserContainer) {
  console.log(type);
  const fileName = "informe-campi." + type;

  const wb = XLSX.utils.book_new();

  const tableDataSheet = XLSX.utils.table_to_sheet(dataTableContainer);
  XLSX.utils.book_append_sheet(wb, tableDataSheet, "Questions Data");

  const tableUsersSheet = XLSX.utils.table_to_sheet(dataUserContainer);
  XLSX.utils.book_append_sheet(wb, tableUsersSheet, "Users Data");

  XLSX.writeFile(wb, fileName);
}

// Function to fetch landing data from the API
async function fetchLandingData() {
  const tableBody = document.querySelector("#dataTableLanding tbody");
  tableBody.innerHTML = ""; // Clear existing data

  try {
    // Call API to get landing data
    const { data, error } = await getDataLanding();

    if (error || !data) {
      console.error("Error fetching landing data:", error);
      return;
    }

    // Iterate over the data and create rows dynamically
    data.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${entry.id}</td>
                <td>${entry.firstName}</td>
                <td>${entry.lastName}</td>
                <td>${entry.email}</td>
                <td>${entry.phone}</td>
                <td>${entry.company}</td>
                <td>${entry.position}</td>
                <td>${entry.date_creation}</td>
            `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching landing data:", error);
  }
}

// Function to export landing data
function exportLandingData(type) {
  const fileName = `landing-report.${type}`;
  const wb = XLSX.utils.book_new();

  // Get the landing table and convert it to a worksheet
  const landingTable = document.getElementById("landingTableContainer");
  const landingSheet = XLSX.utils.table_to_sheet(landingTable);
  XLSX.utils.book_append_sheet(wb, landingSheet, "Landing Data");

  // Write the file
  XLSX.writeFile(wb, fileName);
}

// Add a function to return to the main view
if (returnToMainButton) {
  returnToMainButton.addEventListener("click", () => {
    const containerLanding = document.getElementById("container-landing");
    const containerAnswersData = document.getElementById(
      "container-answersUsers"
    );

    // Cambia la visibilidad de los contenedores
    if (containerLanding && containerAnswersData) {
      containerLanding.style.display = "none";
      containerAnswersData.style.display = "block";
    } else {
      console.error("No se encontraron los contenedores.");
    }
  });
} else {
  console.error("No se encontró el botón 'returnToMainButton'.");
}
