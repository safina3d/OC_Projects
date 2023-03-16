import {CONFIGURATION} from "../utils/config.js";

function getValueFromURL(parameterName) {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    return params.get(parameterName);
}

async function loadDataFrom(jsonFile){
    try {
        const response = await fetch(jsonFile);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

function getPhotographerObjectById(id, photographers) {
    return photographers.find(photographer => photographer.id === id);
}

function getMediasByPhotographerId(id, mediaData) {
    return  mediaData.filter(media => media.photographerId === id);
}

function sumLikes(mediaList) {
    return mediaList.reduce((totalLikes, media) => totalLikes + media.likes, 0);
}

window.addEventListener('load', async () => {
    let photographerId = parseInt(getValueFromURL('photographer'));

    if (!isNaN(photographerId)) {
        const {photographers, media } = await loadDataFrom("./data/photographers.json");

        const photographerCardEl = document.querySelector("card-photographer-horizontal");
        if (photographerCardEl) {
            const photographerObject = getPhotographerObjectById(photographerId, photographers);
            const photographerMediaList = getMediasByPhotographerId(photographerId, media);
            photographerCardEl.data = photographerObject
                ? {...photographerObject,
                    idPhotosLocation: CONFIGURATION.idPhotosLocation,
                    likesTotal: sumLikes(photographerMediaList),
                    photographerMediaList
                }
                : null;


            if (photographerCardEl.data) {
                const galleryGridEl = document.querySelector("gallery-grid");
                galleryGridEl.data = { photographerId, mediaList: photographerMediaList}

                // Create and insert a new form-contact component
                const modalContactEl = document.createElement('modal-contact');
                modalContactEl.isVisible = false;
                photographerCardEl.insertAdjacentElement('afterend', modalContactEl);
            } else {
                photographerCardEl.setAttribute("use-fallback", "");
                photographerCardEl.data = null;
            }
        }
    }
});