function toggleMenu() {
  var x = document.getElementById("navbar");
  if (x.className === "nav-menu") {
      x.className += " mobile";
  } else {
      x.className = "nav-menu";
  }
}

const oreo = document.querySelector(".oreo");
const oreoInside = document.querySelector(".oreo-inside");

oreo.addEventListener("click", () => {
  oreo.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
  oreo.classList.remove("active");
}))