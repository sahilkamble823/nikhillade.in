/* =========================================================
   NAVIGATION, SCROLL REVEALS AND SMALL INTERACTIONS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");
    const currentYear = document.querySelector("#current-year");

    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // Header background after scrolling
    const updateHeader = () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 35);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    // Mobile navigation
    const closeMenu = () => {
        if (!menuToggle || !navMenu) return;
        navMenu.classList.remove("active");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const open = navMenu.classList.toggle("active");
            menuToggle.innerHTML = open
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        });

        navLinks.forEach(link => link.addEventListener("click", closeMenu));
        document.addEventListener("click", event => {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeMenu();
        });
    }

    // Scroll reveal animations
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${(index % 4) * 75}ms`;
            observer.observe(item);
        });
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    // Highlight the section currently in view
    const sections = document.querySelectorAll("main section[id]");
    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px" });
        sections.forEach(section => sectionObserver.observe(section));
    }
});
