import {recipe1, recipes50, recipes5k} from "../../data/recipes.js";
import {recipe10k} from "../../data/recipes10k.js";
// import {recipe20k} from "../../data/recipes20k.js";
// import {recipe30k} from "../../data/recipes30k.js";
// import {recipe40k} from "../../data/recipes40k.js";


export class DataManager {
    static get data() {
        // return recipe1;
        return recipes50;
        // return recipes5k;
        // return recipe10k;
        // return recipe20k;
        // return recipe30k;
        // return recipe40k;
    }

    static get ingredientNameList() {
        return [...new Set(DataManager.data.flatMap(
            recipe => recipe.ingredients.map(ingredient => ingredient.ingredient)))
        ].sort();
    }

    static get deviceNameList() {
        return [...new Set(DataManager.data.map(
            recipe => recipe.appliance))
        ].sort();
    }

    static get ustensilNameList() {
        return [...new Set(DataManager.data.flatMap(
            recipe => recipe.ustensils))
        ].sort();
    }

    static getRecipe(recipeId) {
        return DataManager.data[recipeId - 1];
    }

    // TODO: SUpprimer si pas utilisée
    static getRecipeText(recipe) {
        // Initialiser un objet Set pour stocker les mots uniques
        const uniqueWords = new Set();

        // Ajouter le nom et la description de la recette dans le Set
        recipe.name.split(' ').forEach(word => uniqueWords.add(word));
        recipe.description.split(' ').forEach(word => uniqueWords.add(word));

        // Ajouter les noms des ingrédients dans le Set
        recipe.ingredients.forEach(ingredient => {
            ingredient.ingredient.split(' ').forEach(word => uniqueWords.add(word));
        });

        // Convertir le Set en chaîne de caractères et le retourner
        return Array.from(uniqueWords).join(' ');
    }

}