import GenericComponent from '../generic-component.js';

class PhotographerHorizontalCardComponent extends GenericComponent {
    constructor() {
        super();
    }

    static get componentName() {
        return "photographer-horizontal-card"
    }

    updateLikesCount(value) {
        const totalLikesElement = this.shadowRoot.querySelector(".card__likes-total");
        const currentValue = parseInt(totalLikesElement.textContent);
        totalLikesElement.textContent = currentValue + value;
    }

    _doWhenReady(){
        const contactButtonElement = this.shadowRoot.querySelector('#card__contact-btn');
        const contactModalElement = this.shadowRoot.querySelector('modal-contact');

        if (contactButtonElement) {
            // Au clic, Afficher la fenêtre modale de contact
            contactButtonElement.addEventListener("click", () => {
                contactModalElement.data = this.data;
                contactModalElement.isVisible = true;
            });
        }

    }
}

customElements.define(PhotographerHorizontalCardComponent.componentName, PhotographerHorizontalCardComponent);
