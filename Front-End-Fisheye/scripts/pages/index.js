import {CONFIGURATION} from "../utils/config.js";

window.addEventListener('load', async () => {

    const photographerSection = document.querySelector('.photographer_section');
    const response = await fetch("./data/photographers.json");
    const {photographers} = await response.json();

    photographers.forEach(function (photographer) {
        const cardPhotographer = document.createElement('card-photographer');
        cardPhotographer.data = {...photographer, idPhotosLocation: CONFIGURATION.idPhotosLocation};
        photographerSection.appendChild(cardPhotographer);
    });

});
