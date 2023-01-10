export function initCollapsibleBehaviour() {
  let collapsible = document.getElementById("menu-collapsible");
  let menuContents = document.getElementById("menu-contents");
  menuContents.style.display = "block"; // initialised to block, so that the if statement in the event listener works correctly

  collapsible.addEventListener("click", () => {
    collapsible.classList.toggle("active"); // required for the +/- icons to appear correctly
    if (menuContents.style.display === "block") {
      menuContents.style.display = "none";
    } else {
      menuContents.style.display = "block";
    }
  });
}
