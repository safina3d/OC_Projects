import GenericComponent from '../generic-component.js';

class CardPhotographerHorizontalComponent extends GenericComponent {
  
    constructor() {
        super();
    }

    static get componentName() {
        return "card-photographer-horizontal"
    }

    connectedCallback(){
        this.addEventListener('componentReadyEvent', this._doWhenReady);
    }

    disconnectedCallback(){
        this.removeEventListener('componentReadyEvent', this._doWhenReady);
    }
    
    _doWhenReady(){
        const contactModalElement = document.querySelector('modal-contact');
        if (contactModalElement) {
            const contactBtn = this.shadowRoot.querySelector('#card__contact-btn');
            contactBtn.addEventListener('click', () => {
                contactModalElement.data = this.data;
                contactModalElement.isVisible = true;
            });
        }
    }
}

customElements.define(CardPhotographerHorizontalComponent.componentName, CardPhotographerHorizontalComponent);
  