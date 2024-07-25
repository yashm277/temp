// Create a slider element
let slider = document.createElement("input");
slider.type = "range";
slider.min = 0;
slider.max = 100;
slider.value = 18;
slider.style.position = "fixed";
slider.style.top = "10px";
slider.style.left = "10px";
slider.id = "slider";

// Add the slider to the body
document.body.appendChild(slider);

// Create a display element
let display = document.createElement("span");
display.style.position = "fixed";
display.style.top = "10px";
display.style.left = "150px";
display.id = "display";
display.innerText = slider.value;

// Add the display to the body
document.body.appendChild(display);

// Define your global variable
let temp1 = {
    position: {
        x: 18
    }
};

// Add an event listener to the slider to update the global variable
slider.addEventListener("input", function() {
    temp1.position.x = parseInt(slider.value);
    display.innerText = slider.value;
    console.log("temp1.position.x =", temp1.position.x);
});

// Initial console log to confirm the initial value
console.log("Initial temp1.position.x =", temp1.position.x);
