import { getData } from '../../../API/API.js'; // Ruta relativa de tu archivo API

document.addEventListener('DOMContentLoaded', () => {
    const submitPasswordButton = document.getElementById('submitPassword');
    const passwordInput = document.getElementById('adminPassword');
    const dataTableContainer = document.getElementById('dataTableContainer');
    const userTableContainer = document.getElementById('dataUserContainer');
    const containerAnswersData = document.getElementById('container-answersUsers')
    const errorMessage = document.getElementById('errorMessage');
    const containerAdmin = document.getElementById("adminSection");
    const btnXlsx = document.querySelector('#btnXlsx');
    const btnXls = document.querySelector('#btnXls');
    const btnCsv = document.querySelector('#btnCsv');

    // Contraseña estática para este ejemplo (en producción debe validarse en el backend)
    const ADMIN_PASSWORD = 'campuslands2024';

    // Evento al hacer clic en el botón "Submit"
    submitPasswordButton.addEventListener('click', async () => {
        const enteredPassword = passwordInput.value;

        if (enteredPassword === ADMIN_PASSWORD) {
            errorMessage.style.display = 'none'; // Oculta el mensaje de error
            dataTableContainer.style.display = 'block'; // Muestra la tabla
            userTableContainer.style.display= 'block';
            containerAnswersData.style.display= 'block';
            // containerAdmin.style.display= 'block';
            passwordInput.style.display = 'none';
            submitPasswordButton.style.display = 'none';
            await fetchTodayData(); // Llama al método para cargar los datos
            await fetchUserTodayData();
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
});



async function fetchTodayData() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Limpia cualquier dato existente

    try {
        // Llama al API para obtener datos
        const { data, error } = await getData('admin/messages/today');

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

async function fetchUserTodayData() {
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = ''; // Limpia cualquier dato existente

    try {
        // Llama al API para obtener datos
        const { data, error } = await getData('admin/users/today');

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