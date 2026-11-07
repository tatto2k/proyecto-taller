const API_URL = "http://localhost:3000";

function login() {
    const mail = document.getElementById('input-mail').value;
    const password = document.getElementById('input-password').value;

    axios.post(`${API_URL}/user/login`, {
        user_mail: mail,
        user_password: password
    })
    .then(res => {
        console.log(res);
        localStorage.setItem("token", res.data.message);
        window.location.href = "empleados.html";
    })
    .catch(err => {
        console.error(err);
        if (err.response && err.response.data) {
            alert("Usuario no registrado o contraseña incorrecta");
        } else {
            alert("Error de conexión con el servidor");
        }
    });
}