
const btnProductos = document.getElementById('btnProductos');
const tbody = document.querySelector('.tbody');
const btnCarrito = document.getElementById('btnCarrito');
const btnComprar = document.getElementById('btnComprar');
const carro = document.getElementById('carro');
const listaProductos = document.getElementById('listaProductos');
const cards = document.getElementById('cards');

let carrito = [];

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        
        data.forEach(producto => {
            const productoElement = document.createElement('div');
            productoElement.innerHTML = `
            <div class="col d-flex justify-content-center h-100">
            <div class="card shadow mb-1 bg-dark rounded" style="width: 20rem;">
              <h5 class="card-title pt-2 text-center text-primary">${producto.nombre}</h5>
              <img src="${producto.img}" class="card-img-top" alt="...">
              <div class="card-body justify-content-evenly">
                <p class="card-text text-white-50 description">${producto.description}</p>
                <h5 class="text-primary">Precio: <span class="precio">$${producto.precio}</span></h5>
                <div class="d-flex justify-content-center flex-column">
                    <button class="btn btn-primary button">Añadir a Carrito</button>
                </div>
              </div>
            </div>
          </div>
          <br>
            `;
            cards.appendChild(productoElement); 
            const Clickbutton = document.querySelectorAll('.button');
            Clickbutton.forEach(btn => {
                btn.addEventListener('click', addToCarritoItem)
              })
                        
        });    

    })
    .catch(error => {
        console.error('Error al obtener los productos', error);
    });


  function addToCarritoItem(e){
    const button = e.target
    const item = button.closest('.card')
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;
    
    const newItem = {
      title: itemTitle,
      precio: itemPrice,
      img: itemImg,
      cantidad: 1
    }
  
    addItemCarrito(newItem)
  }
  
  
  function addItemCarrito(newItem) {
    setTimeout(function() {
      Toastify({
        text: "Producto agregado al carrito!",
        duration: 3000
      }).showToast();
    }, 500);
  
    const InputElemnto = tbody.getElementsByClassName('input__elemento');
  
    // Buscar si el artículo ya está en el carrito
    for (let i = 0; i < carrito.length; i++) {
      if (carrito[i].title.trim() === newItem.title.trim()) {
        carrito[i].cantidad++;
        const inputValue = InputElemnto[i];
        inputValue.value++;
        CarritoTotal();
        return null;
      }
    }
  
    // Si no se encontró, agregar el artículo al carrito
    carrito.push(newItem);
    
    
  }
  
  btnCarrito.addEventListener('click', () => {    
    listaProductos.classList.add('disabled');    
    carro.classList.remove('disabled'); 
    renderCarrito();      
  })

  btnProductos.addEventListener('click', () => {
    listaProductos.classList.remove('disabled');
    carro.classList.add('disabled')
  }) 
  

  
  function renderCarrito(){
    tbody.innerHTML = '';
    carrito.map(item => {
      const tr = document.createElement('tr')
      tr.classList.add('ItemCarrito')
      const Content = `      
      <th scope="row">1</th>
              <td class="table__productos">
                <img src=${item.img}  alt="">
                <h6 class="title">${item.title}</h6>
              </td>
              <td class="table__price"><p>${item.precio}</p></td>
              <td class="table__cantidad">
                <input type="number" min="1" value=${item.cantidad} class="input__elemento">
                <button class="delete btn btn-danger">x</button>
              </td>
      `
      tr.innerHTML = Content;
      tbody.append(tr)
  
      tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
      tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
    })
    CarritoTotal()    
  }

  btnCarrito.addEventListener('click', () => {    
    listaProductos.classList.add('disabled');    
    carro.classList.remove('disabled');   
  })

  function CarritoTotal(){
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')
    carrito.forEach((item) => {
      const precio = Number(item.precio.replace("$", ''))
      Total = Total + precio*item.cantidad      
    })
  
    itemCartTotal.innerHTML = `Total $${Total}`
    addLocalStorage()
  }
  
  function removeItemCarrito(e){
    const buttonDelete = e.target
    const tr = buttonDelete.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    for(let i=0; i<carrito.length ; i++){
  
      if(carrito[i].title.trim() === title.trim()){
        carrito.splice(i, 1)
      }
    }
  
    
  
    setTimeout( function(){
        Toastify({

            text: "Haz removido un producto",
            
            duration: 1500
            
            }).showToast();
    }, 200)
      
  
    tr.remove()
    CarritoTotal()
  }
  
  function sumaCantidad(e){
    const sumaInput  = e.target
    const tr = sumaInput.closest(".ItemCarrito")
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
      if(item.title.trim() === title){
        sumaInput.value < 1 ?  (sumaInput.value = 1) : sumaInput.value;
        item.cantidad = sumaInput.value;
        CarritoTotal()
      }
    })
  }
  
  function addLocalStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }
  
  window.onload = function(){
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if(storage){
      carrito = storage;
      renderCarrito()
    }
  }


  
  btnComprar.addEventListener('click', () => {
    comprar();
  })
  
  function comprar () {    
    if (carrito.length > 0 ){
        Swal.fire({
            icon: 'success',
            title: '¡Genial!',
            text: '¡Gracias por tu compra',    
            showConfirmButton:false,
          });
          carrito = [];    
          localStorage.removeItem('carrito');
          setTimeout( function(){
              location.reload();
          }, 2000);
    }else{
        Swal.fire('Tu carrito está vacío')
    }
    

    
  }