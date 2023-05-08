import { DataManager } from "../data/data-manager.js";
import { Filter } from "../data/filter.js";
import { AutomatonSearch } from "../algorithms/finite-state-machine.js";
import { NaiveSearch } from "../algorithms/naive.js"
import { NaiveOldSearch } from "../algorithms/naive-2.js"
import { BoyerMoore } from "../algorithms/boyer-moore.js";
import { ReversedIndex } from "../algorithms/reversed-index.js";

export const tagFilter = new Filter();


export const tagSearchInputsData = {
    ingredients: {
        input: document.querySelector("#search-input__ingredients"),
        suggestionElement: document.querySelector("#suggestions-ingredients"),
        containerElement: document.querySelector(".search-container__ingredients"),
        data: DataManager.ingredientNameList,
        type: "ingredients",
        placeholderDefault: "Ingrédients",
        placeholderActive: "Rechercher un ingrédient",
    },
    devices: {
        input: document.querySelector("#search-input__devices"),
        suggestionElement: document.querySelector("#suggestions-devices"),
        containerElement: document.querySelector(".search-container__devices"),
        data: DataManager.deviceNameList,
        type: "devices",
        placeholderDefault: "Appareils",
        placeholderActive: "Rechercher un appareil",
    },
    ustensils: {
        input: document.querySelector("#search-input__utensils"),
        suggestionElement: document.querySelector("#suggestions-utensils"),
        containerElement: document.querySelector(".search-container__utensils"),
        data: DataManager.ustensilNameList,
        type: "ustensils",
        placeholderDefault: "Ustensiles",
        placeholderActive: "Rechercher un ustensile",
    },
};

export const mainSearchInputElement = document.querySelector("#main-search__input");
export const tagListElement = document.querySelector(".tag-list");
export const tagInputSearchElements = document.querySelectorAll(".search-input");
const recipeListElement = document.querySelector('#recipe-list');

// ReversedIndex.createIndex(DataManager.data);

// Permet de definir l'algorithme de recherche et de renvoyer le resultat
function getSearchResultsUsingCusomAlgorithm(data, userSearchText) {

    // NAIVE CHAR BY CHAR
    return data.filter(recipe => {
         const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.map(ing => ing.ingredient).join(' ')}`.trim().toLowerCase();
         return NaiveOldSearch.search(text, userSearchText)
    });


    // NAIVE
    /*
    return data.filter(recipe => {
        const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.map(ing => ing.ingredient).join(' ')}`.trim().toLowerCase();
        return NaiveSearch.search(text, userSearchText)
    });
    */

    // AFD
    /*
    const automatonSearch = new AutomatonSearch(userSearchText);
    return data.filter(recipe => {
        const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.map(ing => ing.ingredient).join(' ')}`;
        return automatonSearch.search(text.toLowerCase());
    });
    */

    // BoyerMoore
    /*
    return data.filter(recipe => {
        const text = `${recipe.name} ${recipe.description} ${recipe.ingredients.map(ing => ing.ingredient).join(' ')}`.trim().toLowerCase();
        return BoyerMoore.search(text, userSearchText);
    });
    */

    // Reversed Index
    // return ReversedIndex.search(DataManager.data, userSearchText);

}

// Permet de lancer une recherche en utilisant le texte donné par l'utilisateur
function performMainSearch(userText="") {
    let recipes = DataManager.data;
    if (tagFilter.hasFilters) {
        recipes = getRecipeListFilteredByTags(recipes);
    }
    if (userText) {

        console.time()
        recipes = getSearchResultsUsingCusomAlgorithm(recipes, userText.toLowerCase());
        console.timeEnd()
    }
    return getRecipeListHTMLContent(recipes);
}

// Permet d'appliquer les filtres (tags) choisis par l'utilisateur
function getRecipeListFilteredByTags(recipes) {
    return recipes.filter(recipe => {
        const ingredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
        const devices = [recipe.appliance.toLowerCase()];
        const ustensils = recipe.ustensils.map(ustensil => ustensil.toLowerCase());

        // Verifier que la liste des ingredients contients tous les ingredients choisis dans le filtre
        return (
            tagFilter.ingredientListFilter.every(ingredientFilter => ingredients.includes(ingredientFilter)) &&
            tagFilter.deviceListFilter.every(deviceFilter => devices.includes(deviceFilter)) &&
            tagFilter.ustensilListFilter.every(ustensilFilter => ustensils.includes(ustensilFilter))
        );
    });
}

export function displaySearchResults() {
    const userSearchText = mainSearchInputElement.value.trim().toLowerCase();
    if (userSearchText.length > 0 && userSearchText.length < 3) {
        recipeListElement.innerHTML = `
            <div class="error">
                Veuillez saisir au moins <strong>3 caractères</strong><br>
                dans la barre de recherche principale pour commencer la recherche
            .</div>`
        return;
    }
    const htmlContent = performMainSearch(userSearchText);
    recipeListElement.innerHTML = "";
    recipeListElement.appendChild(htmlContent);
}


// Permet de mettre à jour la liste des recettes
export function getRecipeListHTMLContent(recipeList) {
    // recipeListElement
    const range = document.createRange();
    if (recipeList.length === 0) {
        return range.createContextualFragment(`
            <div class="error"> 
                Aucune recette ne correspond à votre critère… <br>
                vous pouvez chercher « tarte aux pommes », « poisson », etc. 
            </div>`);
    }

    const recipeListFragment = document.createDocumentFragment();
    recipeList.forEach(recipe => {
        const recipeHtml = getRecipeHTML(recipe);
        recipeListFragment.appendChild(range.createContextualFragment(recipeHtml));
    });

    return recipeListFragment;
}

// Permet de recuperer le code HTML correspondant à une recette donnée
export function getRecipeHTML(recipeObject) {
    if (!recipeObject) return;
    const { id, name, time, ingredients, description } = recipeObject;

    // Mettre la liste des ingredients sous forme de liste <li>
    const ingredientsList = ingredients.map(ingredientObject => {
        const { ingredient, quantity, unit } = ingredientObject;
        const formattedQuantity = quantity && unit ? `${quantity} ${unit}` : quantity;

        return `<li class="mb2">
                    <span class="bold"> ${ingredient}${formattedQuantity ? ' :' : ''}</span>
                    ${formattedQuantity ? ` ${formattedQuantity}` : ''}
                </li>`;
    }).join('');

    return `
    <article class="recipe-container" data-id="${id}">
      <div class="recipe-preview">${id}</div>
      <div class="recipe-content">
        <div class="recipe-header">
          <h2 class="recipe-header__title">${name}</h2>
          <p class="recipe-header__duration">
            <img src="images/clock.svg" alt="duration">
            <strong>${time} min</strong>
          </p>
        </div>
        <div class="recipe-body">
          <ul>
            ${ingredientsList}
          </ul>
          <p className="recipe-body__description">${description.substring(0, 200) + "..."}</p>
        </div>
      </div>
    </article>
  `;
}