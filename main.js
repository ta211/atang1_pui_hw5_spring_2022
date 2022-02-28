// Product page
function productBtnGroupUpdate(item) {
    // De-selected previously selected item
    let selected = item.parentNode.getElementsByClassName("selected");
    selected[0].classList.remove("selected");
    // Select this item
    item.classList.add("selected");
}