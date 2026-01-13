interface StyleInfo {
    name: string;
    file: string;
}

const availableStyles: StyleInfo[] = [
    { name: "Styl 1", file: "style-1.css" },
    { name: "Styl 2", file: "style-2.css" },
    { name: "Styl 3", file: "style-3.css" },
];

let currentIndex = 0;

function applyCurrentStyle() {
    const head = document.head;
    const oldLink = document.getElementById("dynamic-style");

    if (oldLink) {
        oldLink.remove();
    }
    const newLink = document.createElement("link");
    newLink.id = "dynamic-style";
    newLink.rel = "stylesheet";
    newLink.href = `/${availableStyles[currentIndex].file}`;
    
    head.appendChild(newLink);
    
    console.log(`Aktywny styl: ${availableStyles[currentIndex].name}`);
}


function createStyleLinks() {
    const container = document.getElementById("style-switcher");
    if (!container) return;

    container.innerHTML = "Wybierz wygląd: ";

    availableStyles.forEach((style, index) => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = style.name;
        link.style.margin = "0 10px";
        link.style.padding = "5px 10px";
        link.style.textDecoration = "none";
        link.style.border = "1px solid #ccc";
        link.style.borderRadius = "4px";

        link.addEventListener("click", (e) => {
            e.preventDefault();
            currentIndex = index;
            applyCurrentStyle();
        });

        container.appendChild(link);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyCurrentStyle();
    createStyleLinks();
});