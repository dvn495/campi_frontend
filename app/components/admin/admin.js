import { getData } from '../../../API/API.js'; // Ruta relativa de tu archivo API

document.addEventListener('DOMContentLoaded', () => {
    const submitPasswordButton = document.getElementById('submitPassword');
    const passwordInput = document.getElementById('adminPassword');
    const dataTableContainer = document.getElementById('dataTableContainer');
    const userTableContainer = document.getElementById('dataUserContainer');
    const containerAnswersData = document.getElementById('container-answersUsers')
    const errorMessage = document.getElementById('errorMessage');
    const btnXlsx = document.querySelector('#btnXlsx');
    const btnXls = document.querySelector('#btnXls');
    const btnCsv = document.querySelector('#btnCsv');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const submitDateRange = document.getElementById('submitDateRange');
    const userCity = document.getElementById("ciudad");

    let ADMIN_PASSWORD = "";
    


    // Evento al hacer clic en el botón "Submit"
    submitPasswordButton.addEventListener('click', async () => {
        const enteredPassword = passwordInput.value;

        fetchPassword();
        if (enteredPassword === ADMIN_PASSWORD) {
            errorMessage.style.display = 'none'; // Oculta el mensaje de error
            // dataTableContainer.style.display = 'block'; // Muestra la tabla
            // userTableContainer.style.display= 'block';
            containerAnswersData.style.display= 'block';
            passwordInput.style.display = 'none';
            submitPasswordButton.style.display = 'none';
            btnXlsx.onclick = () =>{
                exportData('xlsx', dataTableContainer, dataUserContainer);
            }
            btnXls.onclick = () =>{
                exportData('xls', dataTableContainer, dataUserContainer);
            }
            btnCsv.onclick = () =>{
                exportData('cvs', dataTableContainer, dataUserContainer);
            }
        } else {
            errorMessage.style.display = 'block'; // Muestra el mensaje de error
        }
    });

    submitDateRange.addEventListener('click', async() => {
        const enteredStartDate = startDate.value;
        const enteredEndDate = endDate.value;
        const enteredCity = userCity.value;

        if (!enteredEndDate || !enteredStartDate|| !enteredCity) {
            console.error("Por favor, completa todos los campos requeridos.");
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (!enteredStartDate || !enteredEndDate || !enteredCity) {
            alert('Por favor selecciona un rango de fechas válido.');
            return;
        }

        try {
            // Obtener datos basados en el rango de fechas seleccionado
            await fetchDataByDateRange(enteredStartDate, enteredEndDate, enteredCity);
            await fetchUserDataByDateRange(enteredStartDate, enteredEndDate, enteredCity);
            dataTableContainer.style.display = 'block'; // Muestra la tabla
            userTableContainer.style.display= 'block';
        } catch (error) {
            console.error('Error al consultar datos:', error);
        }

    
        
       
    })
    async function fetchPassword() {
        const passwordEndpoint = "password/get"
    
        try {
            const { data, error } = await getData(passwordEndpoint);
    
            if (error || !data) {
                console.error('Error fetching data:', error);
                return;
            }
    
            ADMIN_PASSWORD = data.password;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
});





async function fetchDataByDateRange(startDate, endDate, city) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Limpia cualquier dato existente

    try {
        // Llama al API para obtener datos
        const { data, error } = await getData(`admin/messages/today?start=${startDate}&end=${endDate}&city=${city}`);

        if (error || !data) {
            console.error('Error fetching data:', error);
            return;
        }

        // Itera sobre los datos y crea las filas dinámicamente
        data.forEach((message) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${message.userId}</td>
                <td>${message.content}</td>
                <td>${message.messageId}</td>
                <td>${message.messageTime}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching today data:', error);
    }
}


async function fetchUserDataByDateRange(startDate, endDate, city) {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // Limpia cualquier dato existente

    try {
        // Llama al API para obtener datos
        const { data, error } = await getData(`admin/users/today?start=${startDate}&end=${endDate}&city=${city}`);

        if (error || !data) {
            console.error('Error fetching data:', error);
            return;
        }

        // Itera sobre los datos y crea las filas dinámicamente
        data.forEach((user) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.telefono}</td>
                <td>${user.age}</td>
                <td>${user.availability}</td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching today data:', error);
    }
}






function exportData(type, dataTableContainer, dataUserContainer){
    console.log(type);
    const fileName = "informe-campi."+ type;

    const wb = XLSX.utils.book_new();

    const tableDataSheet = XLSX.utils.table_to_sheet(dataTableContainer);
    XLSX.utils.book_append_sheet(wb, tableDataSheet, "Questions Data");

    const tableUsersSheet = XLSX.utils.table_to_sheet(dataUserContainer);
    XLSX.utils.book_append_sheet(wb, tableUsersSheet, "Users Data");


    XLSX.writeFile(wb, fileName);
}