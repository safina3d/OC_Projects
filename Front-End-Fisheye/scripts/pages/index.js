import {CONFIGURATION} from "../utils/config.js";

window.addEventListener('load', async () => {

    const photographerSection = document.querySelector('.photographer_section');
    const response = await fetch("./data/photographers.json");
    const {photographers} = await response.json();

    photographers.forEach(function (photographer) {
        const cardPhotographer = document.createElement('card-photographer');
        cardPhotographer.data = {
            ...photographer,
            portrait: `${CONFIGURATION.idPhotosLocation}${photographer.portrait}`
        }
        photographerSection.appendChild(cardPhotographer);
    });

});

// idPhotosLocation: CONFIGURATION.idPhotosLocation};
// {
//     "name": "Mimi Keel",
//     "id": 243,
//     "city": "London",
//     "country": "UK",
//     "tagline": "Voir le beau dans le quotidien",
//     "price": 400,
//     "portrait": "MimiKeel.jpg"
// }