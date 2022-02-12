function on_input(id, inrange) {
    let element = document.getElementById("input-" + id);
    let value = element.value;
    if (value == "") {
        element.classList.remove("valid", "invalid");
    } else if (inrange(value)) {
        element.classList.add("valid");
        element.classList.remove("invalid");
    } else {
        element.classList.add("invalid");
        element.classList.remove("valid");
    }
}


document.getElementById("input-temperature").addEventListener('input', on_input("temperature", (value) => { return (value >= 0 && value <= 30) }));