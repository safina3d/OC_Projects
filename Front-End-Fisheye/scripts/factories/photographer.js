import {
    getPhotographerData,
    getPhotographerMediaDataList,
    getPhotographerTotalLikes,
    loadDataFrom
} from "../utils/helper.js";


/** Permet de créer un nouvel élément "photographer-card" avec les données spécifiées */
export function createPhotographerCardElement(photographerData) {
    const cardPhotographer = document.createElement("photographer-card");
    cardPhotographer.data = {
        ...photographerData,
        portrait: `assets/photographers/Photographers-id-photos/${photographerData.portrait}`
    }
    return cardPhotographer;
}

/** Permet de récupérer les données et médias d'un photographe à partir de son id */
export async function getPhotographerHorizontalCardData(photographerId) {
    const { photographers, media } = await loadDataFrom("./data/photographers.json");
    const photographerData = getPhotographerData(photographerId, photographers);
    const photographerMediaList = getPhotographerMediaDataList(photographerId, media);
    return photographerData
        ? {
            data : {
                ...photographerData,
                portrait: `assets/photographers/Photographers-id-photos/${photographerData.portrait}`,
                totalLikes: getPhotographerTotalLikes(photographerMediaList),
            },
            medias : photographerMediaList
        }
        : null;
}

/** Permet de convertir les médias d'un photographe en éléments "image-card" */
export function createImageCards({ photographerId, mediaList }) {
    // Récupération du nom de répertoire du photographe correspondant à l'id fourni
    const photographerDirectory = {
        930: "EllieRose/", 195: "Marcel/", 243: "Mimi/",
        527: "Nabeel/", 925: "Rhode/", 82: "Tracy/"
    }[photographerId];

    const lowResDirectoryPath = `assets/photographers-small/${photographerDirectory}`;
    const highResDirectoryPath = `assets/photographers/${photographerDirectory}`;
    const documentFragment = document.createDocumentFragment();

    mediaList.forEach( media => {
        const cardImageEl = document.createElement('image-card');
        const isVideo = !!media.video;
        cardImageEl.data = {
            ...media,
            isVideo,
            thumbnail: `${lowResDirectoryPath}${isVideo ? media.video.replace(/\.[^/.]+$/, '') + '.jpg' : media.image}`,
            target: `${highResDirectoryPath}${media.video || media.image}`,
        }

        documentFragment.appendChild(cardImageEl);
    });

    return documentFragment;
}
