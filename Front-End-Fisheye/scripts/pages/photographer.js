// Chargement des composants
import "../components/photographer-horizontal-card/photographer-horizontal-card.js"
import "../components/modal-contact/modal-contact.js"
import "../components/gallery-grid/gallery-grid.js"
import "../components/image-card/image-card.js"
import "../components/drop-down/drop-down.js"
import "../components/modal-lightbox/modal-lightbox.js"

// Import des modules
import { getParameterValueFromURL } from "../utils/helper.js";
import { getPhotographerHorizontalCardData } from "../factories/photographer.js";

window.addEventListener('load', async () => {
    const pageTitle = document.querySelector("title");
    const photographerHorizontalCardEl = document.querySelector("photographer-horizontal-card");

    // Récupérer l'id du photographe depuis l'URL et de ses données associées
    const photographerId = parseInt(getParameterValueFromURL('photographer'));
    const photographerData = await getPhotographerHorizontalCardData(photographerId);

    if (photographerData && !isNaN(photographerId)) {
        const galleryGridEl = document.querySelector("gallery-grid");
        photographerHorizontalCardEl.data = photographerData.data;
        galleryGridEl.data = { photographerId, mediaList: photographerData.medias };

        // Capture de l'événement "galleryGridChange" et mise à jour du nombre total de likes
        galleryGridEl.addEventListener("galleryGridChange", (event) => {
            event.stopPropagation();
            photographerHorizontalCardEl.updateLikesCount(event.detail.value);
        }, true)

        // Mise à jour du titre de la page
        pageTitle.textContent = `Fisheye - ${photographerData.data.name}, Photographe`;

    } else {
        // Gestion du cas où le photographerId est incorrect
        photographerHorizontalCardEl.useFallBackTemplate = true;
        pageTitle.textContent = "Fisheye - 404";
    }
});
