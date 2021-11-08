const login = async function() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const result = await axios.post('http://localhost:3000/login', {'username': username, 'password': password});
        if (result.status == 200) {
            // Set cookie then send back to main page
            window.location.href = "http://localhost:3000/";
            return;
        }

    } catch (error) {
        if (error.response.status == 401) {
            document.getElementById('login-error').innerText = "Incorrect Login Information";
            return;
        }

        else {
            document.getElementById('login-error').innerText = "Server Error: Please Try Again Later";
            return;
        }
    }
};

const redirectSignUp = function() {
    window.location.href = "http://localhost:3000/pages/signup.html";
};