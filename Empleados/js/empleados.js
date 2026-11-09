const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

const headers = {
    'Authorization': `Bearer ${token}`
};

let idModificar = null;

function mostrarError(err, mensajePorDefecto) {
    console.error(err);

    if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        alert("Tu sesión no es válida. Inicia sesión de nuevo.");
        window.location.replace("login.html");
        return;
    }

    if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
    } else if (!err.response) {
        alert("Error de conexión con el servidor");
    } else {
        alert(mensajePorDefecto);
    }
}

function cargarEmpleados() {
    axios.get(`${API_URL}/empleados`, { headers })
    .then(res => {
        const empleados = Array.isArray(res.data) ? res.data : res.data.message;
        dibujarTabla(empleados);
    })
    .catch(err => mostrarError(err, "Error al cargar los empleados"));
}

function dibujarTabla(empleados) {
    const tbody = document.getElementById('tabla-empleados');
    tbody.innerHTML = '';

    empleados.forEach(emp => {
        const fila = document.createElement('tr');


        [emp.emp_id, emp.emp_nombre, emp.emp_apellidos, emp.emp_telefono, emp.emp_correo, emp.emp_direccion]
        .forEach(valor => {
            const celda = document.createElement('td');
            celda.textContent = valor;
            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-warning btn-sm me-1';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => cargarParaEditar(emp));

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn btn-danger btn-sm';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => eliminarEmpleado(emp.emp_id));

        celdaAcciones.appendChild(btnEditar);
        celdaAcciones.appendChild(btnEliminar);
        fila.appendChild(celdaAcciones);

        tbody.appendChild(fila);
    });
}

function agregarEmpleado() {
    const datos = {
        emp_nombre: document.getElementById('nombre').value,
        emp_apellidos: document.getElementById('apellidos').value,
        emp_telefono: document.getElementById('telefono').value,
        emp_correo: document.getElementById('correo').value,
        emp_direccion: document.getElementById('direccion').value
    };

    if (idModificar === null) {
        axios.post(`${API_URL}/empleados`, datos, { headers })
        .then(res => {
            alert("Empleado registrado con éxito");
            limpiarCampos();
            cargarEmpleados();
        })
        .catch(err => mostrarError(err, "Error al registrar empleado"));
    } else {
        axios.put(`${API_URL}/empleados/${idModificar}`, datos, { headers })
        .then(res => {
            alert("Empleado modificado con éxito");
            idModificar = null;
            document.getElementById('btn-guardar').textContent = "Guardar Empleado";
            limpiarCampos();
            cargarEmpleados();
        })
        .catch(err => mostrarError(err, "Error al modificar empleado"));
    }
}

function cargarParaEditar(emp) {
    idModificar = emp.emp_id;
    document.getElementById('nombre').value = emp.emp_nombre;
    document.getElementById('apellidos').value = emp.emp_apellidos;
    document.getElementById('telefono').value = emp.emp_telefono;
    document.getElementById('correo').value = emp.emp_correo;
    document.getElementById('direccion').value = emp.emp_direccion;

    document.getElementById('btn-guardar').textContent = "Actualizar Empleado";
}

function eliminarEmpleado(id) {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
        axios.delete(`${API_URL}/empleados/${id}`, { headers })
        .then(res => {
            alert("Empleado eliminado");
            cargarEmpleados();
        })
        .catch(err => mostrarError(err, "Error al eliminar"));
    }
}

function buscarEmpleado() {
    const texto = document.getElementById('input-buscar').value;

    if (texto.trim() === "") {
        cargarEmpleados();
        return;
    }


    axios.get(`${API_URL}/empleados`, { headers, params: { nombre: texto } })
    .then(res => {
        const empleados = Array.isArray(res.data) ? res.data : res.data.message;
        dibujarTabla(empleados);
    })
    .catch(err => mostrarError(err, "Error al buscar empleados"));
}

function limpiarCampos() {
    document.getElementById('nombre').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('telefono').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('direccion').value = '';
}

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.replace("login.html");
}


if (!token) {
    alert("Por favor, inicia sesión primero.");
    window.location.replace("login.html");
} else {
    cargarEmpleados();
}
