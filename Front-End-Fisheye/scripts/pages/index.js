// Chargement des composants
import "../components/photographer-card/photographer-card.js";

// Import des modules
import { loadDataFrom } from "../utils/helper.js";
import { createPhotographerCardElement } from "../factories/photographer.js";


window.addEventListener("load", async () => {
    const photographerSectionElement = document.querySelector(".photographer_section");
    const fragment = document.createDocumentFragment();

    // Chargement des données des photographes à partir du fichier JSON
    const { photographers } = await loadDataFrom("./data/photographers.json")

    photographers.forEach( photographerData => {
        const photographerCardElement = createPhotographerCardElement(photographerData);
        fragment.appendChild(photographerCardElement);
    });

    photographerSectionElement.appendChild(fragment);
});
