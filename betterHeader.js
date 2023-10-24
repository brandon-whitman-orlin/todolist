document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector("header");
    headerHandler(header);
});

function headerHandler(header) {
    const logoHalf = header.querySelector(".realHeader .logoLink");
    const navHalf = header.querySelector(".realHeader .navBar");
    const spaceHolder = navHalf.querySelector(".spaceHolder");
    const openNav = spaceHolder.querySelector(".openNav");
    const distanceChecker = navHalf.querySelector(".distanceChecker");

    const rect = navHalf.getBoundingClientRect();
    spaceHolder.style.width = `${rect.width}px`
    spaceHolder.style.height = `${rect.height}px`

    const ul = navHalf.querySelector("ul");
    ul.style.position = "absolute";

    window.addEventListener('resize', function() {
        hideMenu(navHalf);
    });

    openNav.addEventListener('click', toggleMenu);

    function toggleMenu() {
        const isOpen = ul.getAttribute("data-open") === "true";
        ul.setAttribute("data-open", isOpen ? "false" : "true");
    
        const hamburger = openNav.querySelector(".hamburger");
        const close = openNav.querySelector(".close");
    
        if (isOpen) {
            hamburger.style.opacity = 1;
            close.style.opacity = 0;
        } else {
            hamburger.style.opacity = 0;
            close.style.opacity = 1;
        }
    }

    function hideMenu(nav) {
        const logoRect = logoHalf.getBoundingClientRect();
        const distanceCheckerRect = distanceChecker.getBoundingClientRect();
        const overlapDetected = logoRect.right > distanceCheckerRect.left;
    
        if (overlapDetected) {
            nav.setAttribute("data-expanded", "false");
        } else {
            nav.setAttribute("data-expanded", "true");
        }
    }

    hideMenu(navHalf);
}