export function initCollapsibleBehaviour() {
  let collapsible = document.getElementById("menu-collapsible");
  collapsible.addEventListener("click", () => {
    collapsible.classList.toggle("active");
    let menuContents = document.getElementById("menu-contents");
    if (menuContents.style.display === "block") {
      menuContents.style.display = "none";
    } else {
      menuContents.style.display = "block";
    }
  });
}
