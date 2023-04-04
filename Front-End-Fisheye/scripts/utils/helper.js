/** Permet de charger les données d'un fichier JSON. */
export async function loadDataFrom(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        return response.json();
    } catch (error) {
        console.error(error);
    }
}

/** Permet de récupérer la valeur d'un paramètre spécifique depuis l'URL de la page. */
export function getParameterValueFromURL(parameterName) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get(parameterName);
}

/** Permet de récupérer les données d'un photographe grâce son id. */
export function getPhotographerData(id, photographerDataList) {
    return photographerDataList.find(photographer => photographer.id === id);
}

/** Permet de récupérer la liste des médias d'un photographe grâce son id. */
export function getPhotographerMediaDataList(id, mediaDataList) {
    return  mediaDataList.filter(media => media.photographerId === id);
}

/** Permet de récupérer le nombre total de mentions "j'aime" pour un photographe donné. */
export function getPhotographerTotalLikes(photographerMediaDataList) {
    return photographerMediaDataList.reduce((total, media) => total + media.likes, 0);
}
