var socket = io(); 

var form = document.getElementById("form");
var input = document.getElementById("input");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", input.value.slice(0, 1000));
    input.value = "";
  }
});

socket.on("message", msg => {
  var item = document.createElement("li");
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});