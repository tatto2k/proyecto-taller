window.onload = init;
var headers = {};
var url = "http://localhost:3000";
var idModificar = null;

function init() {
    if (localStorage.getItem("token")) {
        headers = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        }
        loadEmpleados();
    }
    else {
        alert("Por favor, inicia sesión primero.");
        window.location.href = "login.html";
    }
}

function mostrarError(err, mensaje) {
    console.log(err);

    if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        alert("Tu sesión no es válida. Inicia sesión de nuevo.");
        window.location.href = "login.html";
    }
    else if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
    }
    else if (!err.response) {
        alert("Error de conexión con el servidor");
    }
    else {
        alert(mensaje);
    }
}

function loadEmpleados() {
    axios.get(url + "/empleados", headers)
    .then(function(res) {
        console.log(res);
        displayEmpleados(res.data.message);
    }).catch(function(err) {
        mostrarError(err, "Error al cargar los empleados");
    })
}

function crearFila(emp) {
    var fila = document.createElement("tr");
    var datos = [emp.emp_id, emp.emp_nombre, emp.emp_apellidos, emp.emp_telefono, emp.emp_correo, emp.emp_direccion];

    for (var i = 0; i < datos.length; i++) {
        var celda = document.createElement("td");
        celda.textContent = datos[i];
        fila.appendChild(celda);
    }

    var acciones = document.createElement("td");

    var btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-warning btn-sm me-1";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", function() {
        cargarParaEditar(emp);
    });

    var btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-danger btn-sm";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function() {
        eliminarEmpleado(emp.emp_id);
    });

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);
    fila.appendChild(acciones);

    return fila;
}

function displayEmpleados(empleados) {
    var tbody = document.getElementById("tabla-empleados");
    tbody.innerHTML = "";

    for (var i = 0; i < empleados.length; i++) {
        tbody.appendChild(crearFila(empleados[i]));
    }
}

function agregarEmpleado() {
    var datos = {
        emp_nombre: document.getElementById("nombre").value,
        emp_apellidos: document.getElementById("apellidos").value,
        emp_telefono: document.getElementById("telefono").value,
        emp_correo: document.getElementById("correo").value,
        emp_direccion: document.getElementById("direccion").value
    };

    if (idModificar === null) {
        axios.post(url + "/empleados", datos, headers)
        .then(function(res) {
            alert("Empleado registrado con éxito");
            limpiarCampos();
            loadEmpleados();
        }).catch(function(err) {
            mostrarError(err, "Error al registrar empleado");
        })
    }
    else {
        axios.put(url + "/empleados/" + idModificar, datos, headers)
        .then(function(res) {
            alert("Empleado modificado con éxito");
            idModificar = null;
            document.getElementById("btn-guardar").textContent = "Guardar Empleado";
            limpiarCampos();
            loadEmpleados();
        }).catch(function(err) {
            mostrarError(err, "Error al modificar empleado");
        })
    }
}

function cargarParaEditar(emp) {
    idModificar = emp.emp_id;
    document.getElementById("nombre").value = emp.emp_nombre;
    document.getElementById("apellidos").value = emp.emp_apellidos;
    document.getElementById("telefono").value = emp.emp_telefono;
    document.getElementById("correo").value = emp.emp_correo;
    document.getElementById("direccion").value = emp.emp_direccion;

    document.getElementById("btn-guardar").textContent = "Actualizar Empleado";
}

function eliminarEmpleado(id) {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
        axios.delete(url + "/empleados/" + id, headers)
        .then(function(res) {
            alert("Empleado eliminado");
            loadEmpleados();
        }).catch(function(err) {
            mostrarError(err, "Error al eliminar");
        })
    }
}

function buscarEmpleado() {
    var texto = document.getElementById("input-buscar").value.trim();

    if (texto === "") {
        loadEmpleados();
        return;
    }

    if (/^\d+$/.test(texto)) {
        axios.get(url + "/empleados", headers)
        .then(function(res) {
            var filtrados = res.data.message.filter(function(emp) {
                return String(emp.emp_id) === texto;
            });
            displayEmpleados(filtrados);
        }).catch(function(err) {
            mostrarError(err, "Error al buscar empleados");
        })
        return;
    }

    axios.get(url + "/empleados/name/" + encodeURIComponent(texto), headers)
    .then(function(res) {
        displayEmpleados(res.data.message);
    }).catch(function(err) {
        mostrarError(err, "Error al buscar empleados");
    })
}

function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellidos").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("direccion").value = "";
}

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}