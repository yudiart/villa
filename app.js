// variable
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');




//Cart
let cart= [];

// Getting the products
class Rooms{
	async getRooms(){
		try{
			let result = await fetch("http://vodonesia.id/api/room");
			let data =  await result.json();
			let rooms = data;
			rooms = rooms.map(item =>{
				const {date,description,harga,limit,roomName,tipeKamar,_id} = item;
				const images = item.images;
				return {date,description,harga,limit,roomName,tipeKamar,images,_id}
				
			})
			return rooms
		}catch(error){
			console.log(error);
		}
		
	}
}
// display products
class UI{
	displayRooms(rooms){
		let result = '';
		rooms.forEach(room=>{
			result +=`
			<!-- Single Product -->
				<article class="product">
					<div class="img-container">
						<img src=${room.images[[0]]} alt="room" class="product-img" style="height:250px;object-fit: cover;">
						<button class="bag-btn" data-id=${room._id}>
							<i class="fas fa-shopping-cart"></i>
							add to bag
						</button>
					</div>
					<h3>${room.roomName}</h3>
					<h4>${room.harga}</h4>
				</article>
			<!-- end of single products -->
			`;
		});
		productsDOM.innerHTML =result;
	}

	getBagButtons(){
		const buttons = [...document.querySelectorAll(".bag-btn")];
		buttons.forEach(button =>{
			let id = button.dataset.id;
			let inCart = cart.find(item => item.id === id);
			if (inCart){
				button.innetText = "In Cart";
				button.disabled = true
			}
			button.addEventListener('click',(e)=>{
				e.target.innetText = "In Cart";
				e.target.disabled = true;

				// get room from rooms
				let cartItem = {...Storage.getRoom(id),
					amount:1
				};
				// add room to the cart
				cart = [...cart,cartItem];
				// save cart in local storage
				Storage.saveCart(cart);
				// set cart values
				this.setCartValues(cart);
				// display cart
				this.addCartItem(cartItem);
				// Show the cart
				this.showCart();
			});
			
		});

	}
	
	setCartValues(cart){
		let tempTotal = 0;
		let itemsTotal = 0;

		cart.map(item=>{

			tempTotal += item.harga * item.amount;

			itemsTotal += item.amount;

		});
		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}

	addCartItem(item){
		const div = document.createElement('div');
		div.classList.add('cart-item');
		div.innerHTML = `
				<img src=${item.images[0]} alt="Room"/>
				<div>
					<h4>${item.roomName}</h4>
					<h5>${item.harga}</h5>
					<span class="remove-item" data-id=${item._id}>remove</span>
				</div>
				<div>
					<i class="fas fa-chevron-up" data-id=${item._id}></i>
					<p class="item-amount">${item.amount}</p>
					<i class="fas fa-chevron-down" data-id=${item._id}></i>
				</div>
		`;
		cartContent.appendChild(div);
		console.log(cartContent);
	}

	showCart(){
		cartOverlay.classList.add('transparentBcg');
		cartDOM.classList.add('showCart');
	}
	setupAPP(){
		cart =Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		cartBtn.addEventListener('click', this.showCart);
		closeCartBtn.addEventListener('click',this.hideCart);
	}

	populateCart(cart){
		cart.forEach(item=> this.addCartItem(item));
	}

	hideCart(){
		cartOverlay.classList.remove('transparentBcg');
		cartDOM.classList.remove('showCart');
	}

}
// Local storage
class Storage{
	static saveRooms(rooms){
		localStorage.setItem("rooms",JSON.stringify(rooms));
	}

	static getRoom(id){
		let rooms = JSON.parse(localStorage.getItem('rooms'));
		return rooms.find(room =>room._id === id);
	}

	static saveCart(){
		localStorage.setItem('cart',JSON.stringify(cart));
	}

	static getCart(){
		return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
	}
}

document.addEventListener("DOMContentLoaded", ()=>{
 const ui = new UI();
 const room = new Rooms();
 // setup app
 ui.setupAPP();

// Get all products
room.getRooms().then(rooms => {
	ui.displayRooms(rooms);
	Storage.saveRooms(rooms);
	}).then(()=>{
	ui.getBagButtons();
	});
});