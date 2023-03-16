import GenericComponent from '../generic-component.js';

class CardImageComponent extends GenericComponent {

    constructor() {
        super();
    }

    static get componentName() {
        return "card-image";
    }


}


customElements.define(CardImageComponent.componentName, CardImageComponent);