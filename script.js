const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];
const quoteForm = document.querySelector("#quote");
const formNote = document.querySelector("#form-note");

document.querySelector("#year").textContent = new Date().getFullYear();

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 90);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  mainNav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px" },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);

sections.forEach((section) => navObserver.observe(section));

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    formNote.textContent = "Please complete all required fields.";
    return;
  }

  const data = new FormData(quoteForm);
  const subject = `Steel enquiry — ${data.get("product")}`;
  const body = [
    `Name: ${data.get("name")}`,
    `Company: ${data.get("company") || "Not provided"}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email") || "Not provided"}`,
    `Product: ${data.get("product")}`,
    "",
    "Requirement:",
    data.get("details"),
  ].join("\n");

  formNote.textContent = "Opening your email app…";
  window.location.href = `mailto:rrindustrial@rrsteelraipur.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
