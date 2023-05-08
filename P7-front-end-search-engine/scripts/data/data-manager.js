import { recipes50, recipes500, recipes5k } from "../../data/recipes.js";
// import {recipe50k} from "../../data/recipes50k.js";


export class DataManager {
    static get data() {
        return recipes50;
        // return recipes500;
        // return recipes5k;
        // return recipe50k;
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

}