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