window.onload = init;

function init() {
    if(!localStorage.getItem("token")) {
        document.querySelector('.btn-primary').addEventListener('click', login);
    }
    else {
        window.location.href = "empleados.html";
    }
}

function login() {
    var mail = document.getElementById('input-mail').value;
    var pass = document.getElementById('input-password').value;

    axios({
        method: 'post',
        url: 'http://localhost:3000/user/login',
        data: {
            user_mail: mail,
            user_password: pass
        }
    }).then(function(res){
        if(res.data.code === 200){
            localStorage.setItem("token", res.data.message);
            window.location.href = "empleados.html";
        }
        else {
            alert("Usuario y/o contraseña incorrectos")
        }
    }).catch(function(err){
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
            alert(err.response.data.message);
        }
        else if (!err.response) {
            alert("Error de conexión con el servidor");
        }
        else {
            alert("Error en el servidor");
        }
    })
}