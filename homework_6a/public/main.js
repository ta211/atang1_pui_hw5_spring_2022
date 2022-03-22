/******************** Classes ********************/
function CartItem(name, subscribe, option, price, quantity, span, img, link) {
    this.name = name; // "Protein Shakes"
    this.subscribe = subscribe; // boolean
    this.option = option; // "<option name>: <selected option>"
    this.price = price; // "$4.00"
    this.quantity = quantity; // integer >= 1
    this.span = span; // "1 week"
    this.img = img; // "files/products/drink-1.png"
    this.link = link; // "products/drinks/drink-1.html"
}

/******************** Account management ********************/
function login() {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    // user.username = username;
    // user.password = password;
    window.localStorage.setItem("logged-in", true);
    gotoAccountPage('');
}

function logout() {
    window.localStorage.setItem("logged-in", false);
    gotoAccountPage('');
}

function gotoAccountPage(prefix) {
    const loggedin = window.localStorage.getItem("logged-in");
    console.log(loggedin);
    if (loggedin == "true") {
        window.location.href = prefix + 'account.html';
    } else {
        window.location.href = prefix + 'login.html';
    }
}

/******************** Detail page management ********************/
function productBtnGroupUpdate(item) {
    // De-selected previously selected item
    let selected = item.parentNode.getElementsByClassName("selected");
    selected[0].classList.remove("selected");
    // Select this item
    item.classList.add("selected");
}

function decrementQuantity(item) {
    let prev = parseInt(item.parentNode.children[1].value);
    item.parentNode.children[1].value = Math.max(prev - 1, 1);
    if (prev - 1 <= 1) {
        item.parentNode.children[0].classList.add("disabled");
    } 
}

function incrementQuantity(item) {
    let prev = parseInt(item.parentNode.children[1].value);
    item.parentNode.children[1].value = prev + 1;
    if (prev == 1) {
        item.parentNode.children[0].classList.remove("disabled");
    } 
}

function updateQuantity(item) {
    let val = parseInt(item.value);
    if (val <= 1) {
        val = 1;
        item.value = 1;
    }
    if (val) {
        if (val > 1) {
            item.parentNode.children[0].classList.remove("disabled");
        } else { // val == 1
            item.parentNode.children[0].classList.add("disabled");
        }
    }
}

function addToCart(method) {
    // TODO: Subscribed items should be cheaper for like 10%. Add this in the future.
    const name = document.getElementsByClassName("product-info-title")[0].textContent;
    const optionName = document.getElementsByClassName("product-options text")[0].children[0].textContent;
    const selected = document.getElementsByClassName("single-select selected")[0];
    const optionSelected = selected.firstChild.textContent.trim();
    const option = optionName + " " + optionSelected;
    const price = selected.lastChild.textContent.trim();
    const quantity = document.getElementById("quantity").value;
    const span = document.getElementById("delivery-span").value;
    const img = document.getElementById("product-current-image").getAttribute("src").substring(6);
    const link = document.location.href;

    let item;
    if (method == "subscribe") {
        item = new CartItem(name, true, option, price, quantity, span, img, link);
    } else if (method == "one-time") {
        item = new CartItem(name, false, option, price, quantity, span, img, link);
    }

    let cart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(cart)) {
        cart.push(item);
    } else {
        cart = [item];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartSize();
}

function loadCartSize() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let cartSize;
    let element = document.getElementById("cart-icon");
    if (Array.isArray(cart)) {
        cartSize = cart.length;
    } else {
        cartSize = 0;
    }
    element.removeChild(element.lastChild);
    element.appendChild(document.createTextNode("("+cartSize+")"));
}