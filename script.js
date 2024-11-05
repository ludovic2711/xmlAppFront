document.addEventListener("DOMContentLoaded", () => {
  const productoForm = document.getElementById("productoForm");
  const eliminarForm = document.getElementById("eliminarForm");
  const xmlDisplay = document.getElementById("xmlDisplay");

  // Función para actualizar la visualización del XML
  function obtenerXML() {
    fetch("http://localhost:4000/")
      .then((response) => response.text())
      .then((xml) => {
        agregarSelect(xml);
        xmlDisplay.innerText = xml;
      })
      .catch((error) => console.error("Error al obtener XML:", error));
  }

  function crearFila(empleado) {
    const fila = tablaEmpleados.insertRow();

    fila.insertCell().textContent = empleado.id;
    fila.insertCell().textContent = empleado.nombre;
    fila.insertCell().textContent = empleado.salario;
    fila.insertCell().textContent = empleado.cargo;
    const celdaBoton = fila.insertCell();
  }

  function cargarTabla() {
    fetch("http://localhost:4000/")
      .then((response) => response.text())
      .then((xml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");

        // Obtener los elementos 'empleado' del XML
        const empleados = doc.getElementsByTagName("empleado");

        // Crear la tabla y los encabezados
        const tabla = document.createElement("table");
        const encabezado = tabla.createTHead();
        const filaEncabezado = encabezado.insertRow();
        ["ID", "Nombre", "Salario", "Cargo"].forEach((encabezado) => {
          const celda = document.createElement("th");
          celda.textContent = encabezado;
          filaEncabezado.appendChild(celda);
        });

        // Crear las filas de datos
        for (let i = 0; i < empleados.length; i++) {
          const empleado = empleados[i];
          const id = empleado.querySelector("idEmpleado").textContent;
          const nombre = empleado.querySelector("nameEmpleado").textContent;
          const salario = empleado.querySelector("salarioEmpleado").textContent;
          const cargo = empleado.querySelector("cargoEmpleado").textContent;
          crearFila({ id, nombre, salario, cargo });
        }

        // Agregar la tabla al DOM
        const tablaEmpleados = document.getElementById("tabla-empleados");
        // tablaEmpleados.appendChild(tabla);
      })
      .catch((error) => console.error("Error al obtener XML:", error));
  }

  // Manejar el envío del formulario de producto
  productoForm.addEventListener("submit", (e) => {
    // e.preventDefault();

    const id = document.getElementById("miSelect").value;
    
    const name = document.getElementById("nameEmpleado").value;
    const salary = document.getElementById("salarioEmpleado").value;
    const cargo = document.getElementById("cargoEmpleado").value;
  
   
    const metodo = id !== 0 ? "PUT" : "POST"; // PUT para actualizar, POST para agregar
    const endpoint = id !== 0
      ? `http://localhost:4000/${id}`
      : "http://localhost:4000/";


    fetch(endpoint, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, salary, cargo }),
    })
      .then(() => {
        alert("Empleado Guardado !");
        obtenerXML(); // Actualiza el XML mostrado
        productoForm.reset();
      })
      .catch((error) => console.error("Error al guardar producto:", error));
    cargarTabla();
  });

  // Manejar el formulario de eliminación
  eliminarForm.addEventListener("submit", (e) => {
    // e.preventDefault();

    const empleadoId = document.getElementById("eliminarId").value;

    fetch(`http://localhost:4000/${empleadoId}`, { method: "DELETE" })
      .then((response) => response.text())
      .then(() => {
        alert("Empleado eliminado !");

        obtenerXML(); // Actualiza el XML mostrado
        eliminarForm.reset();
      })
      .catch((error) => console.error("Error al eliminar producto:", error));
  });

  function agregarSelect(xml) {
    const select = document.createElement("select");
    select.id = "miSelect"; // Puedes establecer un id si lo necesitas

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    // Obtener los elementos 'empleado' del XML
    const empleados = doc.getElementsByTagName("empleado");

    for (let i = 0; i < empleados.length; i++) {
      empleado = empleados[i];
      const option = document.createElement("option");
      option.value = empleado.querySelector("idEmpleado").textContent;
      option.textContent = empleado.querySelector("idEmpleado").textContent;
      select.appendChild(option);
    }

    const option = document.createElement("option");
    
    option.textContent = "NUEVO";
    option.value = 0;
    select.appendChild(option);

    const contenedor = document.getElementById("productoForm");

    // Agregar el <select> al DOM (por ejemplo, dentro de un div con id 'contenedor')
    contenedor.insertBefore(select, contenedor.firstChild.nextSibling);
  }

  // Cargar el XML inicialmente
  obtenerXML();
  cargarTabla();
  // agregarSelect();
});
