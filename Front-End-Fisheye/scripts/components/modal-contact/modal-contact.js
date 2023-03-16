import GenericComponent from '../generic-component.js';

class ModalContactComponent extends GenericComponent {

    constructor() {
        super();
    }

    get isVisible(){
        return !this.hasAttribute('hidden');
    }

    set isVisible(state){
        state
            ? this.removeAttribute('hidden')
            : this.setAttribute('hidden', '');
    }

    static get componentName() {
        return "modal-contact";
    }

    connectedCallback(){
        this.addEventListener('componentReadyEvent', this._doWhenReady);
    }

    disconnectedCallback(){
        this.removeEventListener('componentReadyEvent', this._doWhenReady);
        this.removeEventListener('click', this._closeModal);
    }

    _doWhenReady(){
        const closeBtn = this.shadowRoot.querySelector("#closeBtn");
        const contactForm = this.shadowRoot.querySelector("#contact-form");

        // Handle close event
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this._closeModal();
            });
        }

        // Handle submit event
        if(contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                console.table(data);
            });
        }
    }

    _closeModal(){
        this.setAttribute('hidden', '');
    }
}


customElements.define(ModalContactComponent.componentName, ModalContactComponent);