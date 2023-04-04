import GenericComponent from '../generic-component.js';

class ModalContactComponent extends GenericComponent {

    constructor() {
        super();
    }
    static get componentName() {
        return "modal-contact";
    }

    get isVisible() {
        return !this.hasAttribute('hidden');
    }

    set isVisible(state) {
        this.toggleAttribute('hidden', !state);
    }

    _doWhenReady() {
        const closeButtonElement = this.shadowRoot.querySelector("#close-btn");
        const contactFormElement = this.shadowRoot.querySelector("#contact-form");
        const contactModalElement = this.shadowRoot.querySelector("#contact-modal");
        contactModalElement.focus();

        closeButtonElement.addEventListener('click', () => {
            this.isVisible = false;
        });

        closeButtonElement.addEventListener("keydown", (event) => {
            if (event.code === "Enter") {
                this.isVisible = false;
            }
        });

        // Gestion de l'envoi du formulaire
        contactFormElement.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactFormElement);
            const data = Object.fromEntries(formData.entries());
            console.table(data);
        });
    }

}


customElements.define(ModalContactComponent.componentName, ModalContactComponent);