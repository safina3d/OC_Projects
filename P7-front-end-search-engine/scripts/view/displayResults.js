export const TAG_ADD_CLICK_EVENT = "TAG_ADD_CLICK_EVENT";
export const TAG_DELETE_CLICK_EVENT = "TAG_DELETE_CLICK_EVENT";


// Permet de mettre à jour la liste des suggestions en fonction du texte saisi par l'utilisateur
export function updateSuggestionList(userText, inputTagSearchData) {
    const { suggestionElement, data } = inputTagSearchData;
    userText = userText.trim().toLowerCase();
    suggestionElement.innerHTML = "";

    const fragment = document.createDocumentFragment();
    // On filtre les données en fonction du texte recherché
    const filteredNames = userText
        ? data.filter(name => name.toLowerCase().includes(userText))
        : data;

    if (filteredNames.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucun resultat";
        li.classList.add("error")
        fragment.appendChild(li);

    } else {
        // Créer un element <li> cliquable pour chaque ingredient, appareil, ...
        filteredNames.forEach((itemName) => {
            const li = document.createElement("li");
            li.textContent = itemName;
            li.addEventListener("click", () => {
                li.dispatchEvent(new CustomEvent(TAG_ADD_CLICK_EVENT, {
                    detail: {
                        tagName: itemName,
                        tagType: inputTagSearchData.type
                    }
                }));
            });
            fragment.appendChild(li);
        });
    }

    suggestionElement.appendChild(fragment);
}


// Permet de faire basculer l'affichage de la liste deroulante des tags
export function toggleSuggestionsList(isOpened, inputTagSearchData) {
    const {placeholderDefault, placeholderActive, suggestionElement, containerElement,} = inputTagSearchData;

    inputTagSearchData.input.placeholder = isOpened ? placeholderDefault : placeholderActive;
    suggestionElement.style.display = isOpened ? "none" : "grid";
    containerElement.classList.toggle("search-container--open");
}


// Permet d'ajouter un tag à la liste des tags
export function createTagElement(tagTypeName, tagText) {
    const divElement = document.createElement("div");
    const imgElement = document.createElement("img");

    divElement.setAttribute("data-name", tagText);
    divElement.classList.add("tag", `tag-${tagTypeName}`);
    divElement.textContent = tagText;

    imgElement.src = "images/cross.svg";
    imgElement.classList.add("tag__delete");
    imgElement.addEventListener("click", () => {
        imgElement.dispatchEvent(new CustomEvent(TAG_DELETE_CLICK_EVENT, {
            detail: {
                tagName: tagText,
                tagType: tagTypeName
            }
        }));
        divElement.remove();
    });

    divElement.appendChild(imgElement);
    return divElement
}
