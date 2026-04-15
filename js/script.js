// Elementos del DOM
const contenedorProductos = document.getElementById("contenedor-productos") // donde se mostrarán los productos
const contenedorCarrito = document.getElementById("contenedorCarrito") // donde se muestran productos en el carrito
const contadorCarrito = document.getElementById("contadorCarrito") // contador productos en carrito
const totalCarrito = document.getElementById("totalCarrito") // precio total del carrito
const btnVaciarCarrito = document.getElementById("btnVaciarCarrito") // botón para vaciar el carrito
const btnCarrito = document.getElementById("btnCarrito") // ver carrito
const carritoDropdown = document.getElementById("carritoDropdown") // menú desplegable carrito
const btnCerrarCarrito = document.getElementById("btnCerrarCarrito") // botón para cerrar el carrito

let carrito = []

// Funciones del localStorage

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito))
}

function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito")

  if (carritoGuardado) {
    carrito = [...JSON.parse(carritoGuardado)]
  }
}
// Funciones del carrito

function agregarAlCarrito(producto) {
  const { id, nombre, precio } = producto

  const productoExistente = carrito.find((item) => item.id === id)

  if (productoExistente) {
    carrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
    )
  } else {
    const nuevoItem = { id, nombre, precio, cantidad: 1 }
    carrito = [...carrito, nuevoItem]
  }

  guardarCarrito()
  renderizarCarrito()
}

const eliminarDelCarrito = (idProducto) => {
  carrito = carrito.filter((item) => item.id !== idProducto)
  guardarCarrito()
  renderizarCarrito()
}

const actualizarCantidad = (idProducto, nuevaCantidad) => {
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(idProducto)
    return
  }

  carrito = carrito.map((item) =>
    item.id === idProducto ? { ...item, cantidad: nuevaCantidad } : item,
  )

  guardarCarrito()
  renderizarCarrito()
}

const vaciarCarrito = () => {
  carrito = []
  localStorage.removeItem("carrito")
  renderizarCarrito()
}

// Funciones de renderizado
function renderizarProductos() {
  contenedorProductos.innerHTML = productosIniciales
    .map((producto) => {
      const { id, nombre, precio, stock } = producto
      return `
    <div class="producto-card">
      <h3>${nombre}</h3>
      <div class="producto-info">
        <span class="precio">${precio.toFixed(2)}€</span>
        <span class="stock">Stock: ${stock}</span>
        <button class="btn-agregar" data-id="${id}">
            Agregar al carrito
        </button>
  </div>
</div>
    `
    })
    .join("")
}

function renderizarCarrito() {
  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `
    <div class="carrito-vacio">
      <p>Tu carrito está vacío</p>
    </div>
    `
    contadorCarrito.textContent = "0"
    totalCarrito.textContent = "0.00€"

    return
  }

  const total = carrito.reduce(
    (suma, { precio, cantidad }) => suma + precio * cantidad,
    0,
  )

  contenedorCarrito.innerHTML = carrito
    .map((item) => {
      const { id, nombre, precio, cantidad } = item
      const subtotal = precio * cantidad

      return `
  <div class="carrito-item">
    <div class="item-info">
      <h4>${nombre}</h4>
      <p class="item-precio">${precio.toFixed(2)}€</p>
    </div>
    <div class="cantidad">
      <button class="btn-cant btn-decrementar" data-id="${id}">-</button>
      <span>${cantidad}</span>
      <button class="btn-cant btn-incrementar" data-id="${id}">+</button>
    </div>
    <div class="item-subtotal">
      ${subtotal.toFixed(2)}€
    </div>
    <button class="btn-eliminar" data-id="${id}">x</button>
</div>

  `
    })
    .join("")

  const totalItems = carrito.reduce((sum, { cantidad }) => sum + cantidad, 0)
  contadorCarrito.textContent = totalItems
  totalCarrito.textContent = total.toFixed(2) + "€"
}

// Eventos
contenedorProductos.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {
    const id = parseInt(e.target.dataset.id)
    const producto = productosIniciales.find((p) => p.id === id)
    if (producto) {
      agregarAlCarrito(producto)
    }
  }
})

// Evento botones del carrito

contenedorCarrito.addEventListener("click", (e) => {
  const id = parseInt(e.target.dataset.id)

  if (e.target.classList.contains("btn-eliminar")) {
    eliminarDelCarrito(id)
  } else if (e.target.classList.contains("btn-decrementar")) {
    const producto = carrito.find((item) => item.id === id)
    if (producto) {
      actualizarCantidad(id, producto.cantidad - 1)
    }
  } else if (e.target.classList.contains("btn-incrementar")) {
    const producto = carrito.find((item) => item.id === id)
    if (producto) {
      actualizarCantidad(id, producto.cantidad + 1)
    }
  }
})

btnCarrito.addEventListener("click", (e) => {
  e.stopPropagation()
  carritoDropdown.classList.toggle("active")
})

btnCerrarCarrito.addEventListener("click", () => {
  carritoDropdown.classList.remove("active")
})

carritoDropdown.addEventListener("click", (e) => {
  e.stopPropagation()
})

btnVaciarCarrito.addEventListener("click", () => {
  if (carrito.length > 0) {
    if (confirm("¿Estás seguro de vaciar el carrito?")) {
      vaciarCarrito()
    }
  }
})

document.addEventListener("click", () => {
  carritoDropdown.classList.remove("active")
})

// Inicio de aplicación
function init() {
  cargarCarrito()
  renderizarProductos()
  renderizarCarrito()
}

init()
