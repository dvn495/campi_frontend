    const URL_API = "https://chatcampuslands.com:8443/chatbot";

    // BASIC CRUD

    const myHeaders = () => {
        const token = localStorage.getItem('authToken');
        return new Headers({
            "content-Type": "application/json",
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
                body: JSON.stringify(datos)
            });
    
            // Return the response and let the calling code handle the redirect
            return response;
    
        } catch (error) {
            console.error('Error durante el proceso:', error);
            throw error; // Propagate the error to be handled by the caller
        }
    };
    
    

    export {
        authData,
        getData,
        postData,
        getElementData
    };
