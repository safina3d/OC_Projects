import GenericComponent from '../generic-component.js';

class PhotographerCardComponent extends GenericComponent {

    constructor() {
        super();
    }

    static get componentName() {
        return "photographer-card"
    }

}

customElements.define(PhotographerCardComponent.componentName, PhotographerCardComponent);