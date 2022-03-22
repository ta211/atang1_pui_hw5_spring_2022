/******************** Classes ********************/
function CartItem(name, subscribe, option, price, quantity, span, img, alt, link) {
    this.name = name; // "Protein Shakes"
    this.subscribe = subscribe; // boolean
    this.option = option; // "<option name>: <selected option>"
    this.price = price; // "$4.00"
    this.quantity = quantity; // integer >= 1
    this.span = span; // "1 week"
    this.img = img; // "files/products/drink-1.png"
    this.alt = alt;
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
    const alt = document.getElementById("product-current-image").getAttribute("alt");
    const link = document.location.href;

    let item;
    if (method == "subscribe") {
        item = new CartItem(name, true, option, price, quantity, span, img, alt, link);
    } else if (method == "one-time") {
        item = new CartItem(name, false, option, price, quantity, span, img, alt, link);
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

function loadCartContent() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(cart)) {
        // hide the notice
        document.getElementById("empty-notice").classList.add("hidden");
        // get the template
        let cartItemTemplate = document.getElementById("cart-item-template");
        // load each item into the template
        let totalPrice = 0;
        for (let entry of cart.entries()) {
            let i = entry[0];
            let item = entry[1];
            console.log(item);
            
            let cartItem = cartItemTemplate.cloneNode(true);
            cartItem.setAttribute("id", "cart-item-"+i);
            console.log(cartItem);
            // Set up item image
            let imgNode = document.createElement("img");
            imgNode.setAttribute("src", item.img);
            imgNode.setAttribute("alt", item.alt);
            let aNode = document.createElement("a");
            aNode.setAttribute("href", item.link);
            aNode.appendChild(imgNode);
            cartItem.getElementsByClassName("cart-item-img")[0].appendChild(aNode);
            // Set up item info - name & options
            cartItem.getElementsByClassName("item-name")[0].textContent = item.name;
            cartItem.getElementsByClassName("item-option")[0].textContent = item.option;
            // Set up item price
            cartItem.getElementsByClassName("price")[0].textContent = item.price;
            totalPrice += Number.parseFloat(item.price.substring(1)) * item.quantity;
            // Set up checkbox
            let checkbox = cartItem.getElementsByClassName("subscription-checkbox")[0].getElementsByTagName("input")[0];
            checkbox.setAttribute("id", "subscription-"+i);
            checkbox.setAttribute("name", "subscription-"+i);
            checkbox.checked=item.subscribe;
            if (item.subscribe) {
                checkbox.setAttribute("class", "checked");
            } else {
                checkbox.setAttribute("class", "");
            }
            // Set up quantity
            let quantitySelector = cartItem.getElementsByClassName("quantity-selector")[0];
            quantitySelector.getElementsByTagName("label")[0].setAttribute("for", "quantity-"+i);
            quantitySelector.getElementsByClassName("quantity-minus")[0].setAttribute("data-field", "quantity-"+i);
            quantitySelector.getElementsByClassName("quantity-plus")[0].setAttribute("data-field", "quantity-"+i);
            let quantityField = quantitySelector.getElementsByClassName("quantity-field")[0];
            quantityField.setAttribute("id", "quantity-"+i);
            quantityField.setAttribute("name", "quantity-"+i);
            quantityField.value = item.quantity;
            updateQuantity(quantityField);
            // Set up delivery
            let spanSelector = cartItem.getElementsByTagName("select")[0];
            spanSelector.setAttribute("id", "delivery-span-"+i);
            spanSelector.setAttribute("name", "delivery-span-"+i);
            spanSelector.value = item.span;
            // Append item to cart-items-inner
            console.log(cartItem);
            document.getElementById("cart-items-inner").appendChild(cartItem);
        }
        document.getElementById("cart-total-price").textContent = "Total: $" + totalPrice.toFixed(2);
    } else {
        document.getElementById("empty-notice").removeAttribute("class", "hidden");
    }
}