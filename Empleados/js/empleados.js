const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

if (!token) {
    alert("Por favor, inicia sesión primero.");
    window.location.href = "login.html";
}

const headers = {
    'Authorization': `Bearer ${token}`
};

let idModificar = null; 

function cargarEmpleados() {
    axios.get(`${API_URL}/empleados`, { headers })
    .then(res => {
        const empleados = Array.isArray(res.data) ? res.data : res.data.message;
        dibujarTabla(empleados);
    })
    .catch(err => {
        console.error(err);
        alert("Error al cargar los empleados");
    });
}

function dibujarTabla(empleados) {
    const tbody = document.getElementById('tabla-empleados');
    tbody.innerHTML = '';

    empleados.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.emp_id}</td>
                <td>${emp.emp_nombre}</td>
                <td>${emp.emp_apellidos}</td>
                <td>${emp.emp_telefono}</td>
                <td>${emp.emp_correo}</td>
                <td>${emp.emp_direccion}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-1" onclick="cargarParaEditar(${emp.emp_id}, '${emp.emp_nombre}', '${emp.emp_apellidos}', '${emp.emp_telefono}', '${emp.emp_correo}', '${emp.emp_direccion}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${emp.emp_id})">Eliminar</button>
                </td>
            </tr>
        `;
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
        .catch(err => {
            console.error(err);
            alert("Error al registrar empleado");
        });
    } else {
        axios.put(`${API_URL}/empleados/${idModificar}`, datos, { headers })
        .then(res => {
            alert("Empleado modificado con éxito");
            idModificar = null;
            document.getElementById('btn-guardar').textContent = "Guardar Empleado";
            limpiarCampos();
            cargarEmpleados();
        })
        .catch(err => {
            console.error(err);
            alert("Error al modificar empleado");
        });
    }
}

function cargarParaEditar(id, nombre, apellidos, telefono, correo, direccion) {
    idModificar = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('apellidos').value = apellidos;
    document.getElementById('telefono').value = telefono;
    document.getElementById('correo').value = correo;
    document.getElementById('direccion').value = direccion;

    document.getElementById('btn-guardar').textContent = "Actualizar Empleado";
}

function eliminarEmpleado(id) {
    if (confirm("¿Estás seguro de eliminar este empleado?")) {
        axios.delete(`${API_URL}/empleados/${id}`, { headers })
        .then(res => {
            alert("Empleado eliminado");
            cargarEmpleados();
        })
        .catch(err => {
            console.error(err);
            alert("Error al eliminar");
        });
    }
}

function buscarEmpleado() {
    const texto = document.getElementById('input-buscar').value;
    
    if (texto.trim() === "") {
        cargarEmpleados();
        return;
    }

    axios.get(`${API_URL}/empleados?nombre=${texto}`, { headers })
    .then(res => {
        const empleados = Array.isArray(res.data) ? res.data : res.data.message;
        dibujarTabla(empleados);
    })
    .catch(err => {
        console.error(err);
    });
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
    window.location.href = "login.html";
}

cargarEmpleados();
