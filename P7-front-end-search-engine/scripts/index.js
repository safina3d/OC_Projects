import {
    tagFilter,
    mainSearchInputElement,
    tagInputSearchElements,
    tagSearchInputsData,
    performMainSearch,
    getRecipeListFilteredByTags,
    displaySearchResults,
    tagListElement
} from "./viewModel/searchEngine.js";

import {
    updateSuggestionList,
    toggleSuggestionsList,
    createTagElement,
    TAG_ADD_CLICK_EVENT,
    TAG_DELETE_CLICK_EVENT
} from "./view/displayResults.js";


// Gestion des événements pour les inputs de recherche de tags
Object.values(tagSearchInputsData).forEach(searchInputData => {
    const { input, containerElement } = searchInputData;

    input.addEventListener("input", (e) => {
        const userText = e.target.value;
        updateSuggestionList(userText, searchInputData);
    });

    // Clic sur la flèche
    containerElement.querySelector(".search-input__arrow")
        .addEventListener("click", () => {
            const isOpened = containerElement.classList.contains("search-container--open");
            toggleSuggestionsList(isOpened, searchInputData);
        });

    input.addEventListener("focus", () => {
        tagInputSearchElements.forEach(el => {
            // Replier les inputs de recherche développés
            const parent = el.parentElement;
            if (el !== input && parent.classList.contains("search-container--open")) {
                const inputSearchType = parent.getAttribute("data-type");
                toggleSuggestionsList(true, tagSearchInputsData[inputSearchType]);
            }
        })
        const isOpened = containerElement.classList.contains("search-container--open");
        updateSuggestionList(input.value, searchInputData);
        toggleSuggestionsList(isOpened, searchInputData);
    });
});


document.addEventListener(TAG_ADD_CLICK_EVENT, (event)=> {
    const { tagName, tagType } = event.detail;

    // Vérifier si le tag existe déjà
    const existingTag = tagListElement.querySelector(`.tag[data-name="${tagName}"]`);
    if (existingTag) {
        return;
    }

    tagFilter.addFilter(tagType, tagName);
    const newTagElement = createTagElement(tagType, tagName);
    tagListElement.appendChild(newTagElement);

    displaySearchResults();

}, true);

document.addEventListener("TAG_DELETE_CLICK_EVENT", (event)=> {
    const { tagName, tagType } = event.detail;
    tagFilter.removeFilter(tagType, tagName);

    displaySearchResults();

}, true);


mainSearchInputElement.addEventListener("input", () => {
    displaySearchResults();
});

displaySearchResults();
