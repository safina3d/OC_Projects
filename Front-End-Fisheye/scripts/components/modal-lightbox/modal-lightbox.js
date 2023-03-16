import GenericComponent from '../generic-component.js';

class ModalLightboxComponent extends GenericComponent {

    constructor() {
        super();
        this.data = {};
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
        return "modal-lightbox";
    }

    get imageTarget(){
        return this.shadowRoot.getElementById('target-image');
    }

    get videoTarget(){
        return this.shadowRoot.getElementById('target-video');
    }

    get previousButton(){
        return this.shadowRoot.querySelector("#previous-btn");
    }

    get nextButton(){
        return this.shadowRoot.querySelector("#next-btn");
    }

    get title(){
        return this.shadowRoot.querySelector("#photo-title");
    }

    get currentCardImageElement(){
        return this._currentCardImageElement;
    }

    set currentCardImageElement(newValue){
        if(newValue){
            this._currentCardImageElement = newValue;
            this._updatePreview();
        }
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

        // Handle close event
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this._closeModal();
            });
        }

        this.previousButton.addEventListener("click", () => {
            this.currentCardImageElement = this.currentCardImageElement.previousElementSibling;
            this._updatePreview();
        });

        this.nextButton.addEventListener("click", () => {
            this.currentCardImageElement = this.currentCardImageElement.nextElementSibling;
            this._updatePreview();
        });

    }

    _updatePreview(){
        if (this.currentCardImageElement){
            const {target, title, isVideo } = this.currentCardImageElement.data;
            this.imageTarget.src = isVideo ? "" : target;
            this.videoTarget.src = isVideo ? target : "";
            this.title.textContent = title;
            this.imageTarget.hidden = isVideo;
            this.videoTarget.hidden = !isVideo;
        }
    }
    _closeModal(){
        this.isVisible = false;
        this.currentCardImageElement = null;
        this.imageTarget.src = "";
        this.videoTarget.src = "";
        this.title.textContent = "";
    }

}


customElements.define(ModalLightboxComponent.componentName, ModalLightboxComponent);