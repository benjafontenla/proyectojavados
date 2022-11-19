//Registro en barra de nav
//Declaro el btn.
let botonRegistro = document.getElementById ("btnregistrarse");
//Armo la function flecha
botonRegistro.onclick = () => {
    Swal.fire({
        title: 'Registrate',
        html: `<input type="mail" id="login" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Password">`,
        confirmButtonText: 'Registrate',
        focusConfirm: false,
        preConfirm: () => {
const login = Swal.getPopup().querySelector('#login').value
const password = Swal.getPopup().querySelector('#password').value
if (!login || !password) {
            Swal.showValidationMessage(`Ingresá tu email y constraseña`)
}
return { login: login, password: password }
        }
}).then((result) => {
        Swal.fire(`
Email: ${result.value.login}
Password: ${result.value.password}
        `.trim())
})
}


// Get item + delcaro. 
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let precioTotal = localStorage.getItem('precioTotal');
precioTotal = parseInt(precioTotal);
let totalCarrito;
let botonFinalizar = document.getElementById('finalizar');

// set item (para setear)
const saveLocal = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//Renderizar prod.
function renderizarProductos() {
    fetch('/productos.json')
        .then((respuesta) => respuesta.json())
        .then((productos) => {
            let html = "";
            for (let i = 0; i < productos.length; i++) {
                html = html +
                    `
                        <div class="card col-md-2">
                            <img src=${productos[i].foto} class="card-img-top" alt="...">
                            <div class="card-body">
                            <h5 class="card-title">${productos[i].id}</h5>
                            <p class="card-text">${productos[i].nombre}</p>
                            <p class="card-text">$ ${productos[i].precio}</p>     
                            <button onclick="addToCart(${productos[i].id});" type="button" class="btn btn-primary btn-lg">Comprar</button>
    
                            </div>
                        </div>
        `;
            }
            document.getElementById('misprods').innerHTML = html;
        })
        .catch((e) => {
            console.log(e);
        });
}

//Renderizar carrito.
function renderizarCarrito() {
    let html = "";
    for (let i = 0; i < carrito.length; i++) {
        html = html +
            `
<tr>
    <th scope="row">${carrito[i].id}</th>
    <td>${carrito[i].nombre}</td>
    <td>$${carrito[i].precio}</td>
    
    <td><i class="fa-solid fa-cart-shopping" onclick="removerCarrito(${i}); saveLocal();" >🗑</i></td>
    </tr>
`;
    }
    document.getElementById('tablabody').innerHTML = html;
}


//Agregar al carrito
function addToCart(id) {
    fetch('/productos.json')
        .then((respuesta) => respuesta.json())
        .then((productos) => {
            const agregarAlCarrito = productos.find((item) => item.id == id);
            carrito.push(agregarAlCarrito);

            //sweetalert
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Producto agregado correctamente al carrito',
                showConfirmButton: false,
                timer: 2000
            })
            renderizarCarrito();
            saveLocal();
            calcularPrecioTotal();
        })
        .catch((e) => {
            console.log(e);
        });
}

//Remover productos del carrito
function removerCarrito(id) {
    carrito.splice(id, 1);
    renderizarCarrito();
    saveLocal();
    calcularPrecioTotal();
}


function calcularPrecioTotal() {
    precioTotal = carrito.reduce((acumulador, productos) => {
        return (acumulador += productos.precio);
    }, 0);
    document.getElementById('total').innerHTML = 'Total: $' + precioTotal;
    saveLocal();
    console.log(precioTotal);
}



//Evento btn finalizar compra
botonFinalizar.onclick = () => {

    if (carrito.length == 0) {
        Swal.fire({
            title: 'El carrito está vacío',
            text: 'Seleccione algun producto',
            icon: 'Error',
            showConfirmButton: false,
            timer: 3000
        })
    } else {

        carrito.splice(0, carrito.length);
        console.log(carrito);
        document.getElementById("tablabody").innerHTML = "";
        let infoTotal = document.getElementById("total");
        infoTotal.innerText = "total $: ";

        notificarCompraExitosa();

        localStorage.removeItem('carrito');
    }
}


//Confirmacion de compra.
function notificarCompraExitosa() {
    //Toastify
    Toastify({
        text: "Compra realizada. Revise su email para encontrar el codigo de seguimiento.",
        duration: 4000,
        gravity: 'bottom',
        position: 'center',
    }).showToast();
}

//Llamados
renderizarProductos();
renderizarCarrito();
calcularPrecioTotal();

