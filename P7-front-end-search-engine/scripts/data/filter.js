export class Filter {
    constructor() {
        this.filters = {
            ingredients: new Set(),
            devices: new Set(),
            ustensils: new Set()
        };
        this.hasFilters = false;
    }

    get ingredientListFilter() {
        return Array.from(this.filters.ingredients);
    }

    get deviceListFilter() {
        return Array.from(this.filters.devices);
    }

    get ustensilListFilter() {
        return Array.from(this.filters.ustensils);
    }

    addFilter(type, value) {
        this.filters[type].add(value.toLowerCase());
        this.hasFilters = true;
    }

    removeFilter(type, value) {
        this.filters[type].delete(value.toLowerCase());
        this.hasFilters = Object.values(this.filters).some((filter) => filter.size > 0);
    }
}
