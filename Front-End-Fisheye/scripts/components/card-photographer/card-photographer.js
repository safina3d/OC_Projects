import GenericComponent from '../generic-component.js';


class CardPhotographerComponent extends GenericComponent {

    constructor() {
        super();
    }

    static get componentName() {
        return "card-photographer"
    }

}

customElements.define(CardPhotographerComponent.componentName, CardPhotographerComponent);