/******************** Classes ********************/
function CartItem(name, subscribe, option, price, quantity, span, img, alt, link) {
    this.name = name; // "Protein Shakes"
    this.subscribe = subscribe; // boolean
    this.option = option; // "<option name>: <selected option>"
    this.price = price; // "$4.00"
    this.quantity = Number.parseInt(quantity); // integer >= 1
    if (this.subscribe) {
        this.span = span; // "1 week"
    }
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
    gotoAccountPage();
}

function logout() {
    window.localStorage.setItem("logged-in", false);
    gotoAccountPage();
}

function gotoAccountPage() {
    const loggedin = window.localStorage.getItem("logged-in");
    // console.log(loggedin);
    if (loggedin == "true") {
        window.location.href = '/public/account.html';
    } else {
        window.location.href = '/public/login.html';
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
    const dataField = item.getAttribute("data-field");
    if (dataField.startsWith('quantity-')) {
        let index = dataField[dataField.length - 1];
        updateCartItem(Number.parseInt(index), 'quantity');
    }
}

function incrementQuantity(item) {
    let prev = parseInt(item.parentNode.children[1].value);
    item.parentNode.children[1].value = prev + 1;
    if (prev == 1) {
        item.parentNode.children[0].classList.remove("disabled");
    } 
    const dataField = item.getAttribute("data-field");
    if (dataField.startsWith('quantity-')) {
        let index = dataField[dataField.length - 1];
        updateCartItem(Number.parseInt(index), 'quantity');
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

function isSameItem(itemA, itemB) {
    return (
        itemA.name == itemB.name && 
        itemA.subscribe == itemB.subscribe &&
        itemA.span == itemB.span && 
        itemA.option == itemB.option
    );
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
    const img = document.getElementById("product-current-image").getAttribute("src");
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
        let index = cart.findIndex(element => isSameItem(item, element));
        if (index != -1) {
            cart[index].quantity = cart[index].quantity + item.quantity;
        } else {
            cart.push(item);
        }
    } else {
        cart = [item];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartSize();

    // window.location.href="../../cart.html";
}

function loadCartSize() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let cartSize;
    let element = document.getElementById("cart-icon");
    if (Array.isArray(cart) && cart.length > 0) {
        // Cart size update
        cartSize = cart.reduce(
            (prevSum, currItem) => prevSum + currItem.quantity,
            0
        );

        // Update lovely little pink bubble
        let sizeNode = document.createElement("div");
        sizeNode.setAttribute("id", "cart-icon-size");
        sizeNode.textContent = cartSize;
        if (element.children.length == 1) {
            element.appendChild(sizeNode);
        } else if (element.children.length == 2) {
            element.replaceChild(sizeNode, element.lastChild);
        }
    }
}

function loadCartContent() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(cart)) {
        // hide the notice
        if (cart.length > 0) {
            document.getElementById("empty-notice").classList.add("hidden");
        }
        // get the template
        let cartItemTemplate = document.getElementById("cart-item-template");
        // clear the cart inner container (reload)
        document.getElementById("cart-items-inner").innerHTML="";
        // load each item into the template
        let totalPrice = 0;
        for (let entry of cart.entries()) {
            let i = entry[0];
            let item = entry[1];
            // console.log(item);
            
            let cartItem = cartItemTemplate.cloneNode(true);
            cartItem.setAttribute("id", "cart-item-"+i);
            // console.log(cartItem);
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

            let itemPrice = Number.parseFloat(item.price.substring(1)) * item.quantity;
            if (!isNaN(itemPrice)) {
                totalPrice += itemPrice;
            }
            // Set up checkbox
            let checkbox = cartItem.getElementsByClassName("subscription-checkbox")[0].getElementsByTagName("input")[0];
            checkbox.setAttribute("id", "subscription-"+i);
            checkbox.setAttribute("name", "subscription-"+i);
            checkbox.checked=item.subscribe;
            checkbox.setAttribute("onchange","updateCartItem(" + i + ", 'subscribe')");
            if (item.subscribe) {
                checkbox.setAttribute("class", "checked");
            } else {
                checkbox.setAttribute("class", "");
                cartItem.getElementsByClassName("delivery-span-selector")[0].classList.add("hidden");
            }

            // Set up quantity
            let quantitySelector = cartItem.getElementsByClassName("quantity-selector")[0];
            quantitySelector.getElementsByTagName("label")[0].setAttribute("for", "quantity-"+i);
            quantitySelector.getElementsByClassName("quantity-minus")[0].setAttribute("data-field", "quantity-"+i);
            quantitySelector.getElementsByClassName("quantity-plus")[0].setAttribute("data-field", "quantity-"+i);
            let quantityField = quantitySelector.getElementsByClassName("quantity-field")[0];
            quantityField.setAttribute("id", "quantity-"+i);
            quantityField.setAttribute("name", "quantity-"+i);
            quantityField.setAttribute("onchange","updateQuantity(this); updateCartItem(" + i + ", 'quantity');");
            quantityField.value = item.quantity;
            updateQuantity(quantityField);

            // Set up delivery
            let spanSelector = cartItem.getElementsByTagName("select")[0];
            spanSelector.setAttribute("id", "delivery-span-"+i);
            spanSelector.setAttribute("name", "delivery-span-"+i);
            spanSelector.setAttribute("onchange","updateCartItem(" + i + ", 'span')");
            spanSelector.value = item.span;
            
            // Set up removal method
            cartItem.getElementsByClassName("cart-item-removal-method")[0].setAttribute("onclick", "removeCartItem("+i+");")

            // Append item to cart-items-inner
            // console.log(cartItem);
            document.getElementById("cart-items-inner").appendChild(cartItem);
        }
        document.getElementById("cart-total-price").textContent = "Total: $" + totalPrice.toFixed(2);
    } else {
        document.getElementById("empty-notice").removeAttribute("class", "hidden");
    }
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let removedItem = cart.splice(index,1)[0];
    let isExecuted = confirm("Are you sure you want to remove " + removedItem.name + " - " + removedItem.option + " x " + removedItem.quantity + " ?");
    if (isExecuted) {
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCartSize();
        window.location.reload();
    }
}

function updateCartItem(index, attribute) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    let updatedItem = cart[index];
    switch(attribute) {
        case "subscribe": {
            updatedItem.subscribe = !updatedItem.subscribe;
            if (!updatedItem.subscribe) {
                updateCartItem.span = null;
            }
            break;
        }
        case "quantity": {
            updatedItem.quantity = Number.parseInt(document.getElementById("quantity-"+index).value);
            break;
        }
        case "span": {
            updatedItem.span = document.getElementById("delivery-span-"+index).value;
            break;
        }
    }

    // Update local storage
    cart.splice(index, 1, updatedItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCartContent();
    loadCartSize();
}

function toggleCartDrawer() {
    const cartDrawer = document.getElementById("cart-drawer");
    const darkScreen = document.getElementById("screen");
    if (cartDrawer.classList.contains("cart-drawer-folded")) { // Cart is hidden
        // Unfold cart
        cartDrawer.classList.remove("cart-drawer-folded");
        // Make screen dark
        darkScreen.classList.add("dark-screen");
    } else { // Cart is already pulled out
        // Fold cart
        cartDrawer.classList.add("cart-drawer-folded");
        // Remove dark screen
        darkScreen.classList.remove("dark-screen");
    }
}