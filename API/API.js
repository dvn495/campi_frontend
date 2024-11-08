    const URL_API = "http://localhost:8080";

    // BASIC CRUD

    const myHeaders = () => {
        const token = localStorage.getItem('authToken');
        return new Headers({
            "content-Type": "aplication/json",
            "Authorization": `Bearer ${token}`
        });
    };

    const getData = async(endpoint) => {
        try {
            const response = await fetch(`${URL_API}/${endpoint}`, {
                headers: myHeaders()
            });
            if (response.ok) {
                const data = await response.json();
                return { data, response};
            }
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        } catch (error) {
            console.error('Error fetching data:', error);
            return { data: null, error};
        }
    };

    const getElementData = async(endpoint, id) => {
        try {
            return await fetch(`${URL_API}/${endpoint}/${id}`, {
                headers: myHeaders()
            });
        } catch(error){
            console.log(error);
        }
    };

    const postData = async (datos, endpoint) => {
        try {
            const response = await fetch(`${URL_API}/${endpoint}`, {
                method: "POST",
                headers: myHeaders(),
                body: JSON.stringify(datos)
            });

            if (!response.ok) {
                const errorMessage = await response.text(); 
                console.error(`Error ${response.status}: ${errorMessage}`);
            }

            return response;
        } catch (error) {
            console.error('Error en la solicitud POST:', error.message);
        }
    };

    const authData = async (datos, endpoint) => {
        try {
            const response = await fetch(`${URL_API}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            });
    
            let data;
            try {
                data = await response.json();
            } catch {
                data = null; // Si la respuesta no es JSON válido
            }
    
            const messageElement = document.getElementById('message');
    
            if (response.ok) {
                if (messageElement) {
                    messageElement.textContent = 'Login exitoso! Redirigiendo...';
                }
                localStorage.setItem('authToken', data ? data.token : '');
                window.location.href = '/View/index.html'; 
            } else {
                if (messageElement) {
                    messageElement.textContent = data ? data.message : 'Error en el login';
                }
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            const messageElement = document.getElementById('message');
            if (messageElement) {
                messageElement.textContent = 'Error de conexión';
            }
        }
    };
    
    

    export {
        authData,
        getData,
        postData,
        getElementData
    };