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

    get title(){
        return this.shadowRoot.querySelector("#photo-title");
    }

    get loader(){
        return this.shadowRoot.querySelector("#loader");
    }

    get previousButton(){
        return this.shadowRoot.querySelector("#previous-btn");
    }

    get nextButton(){
        return this.shadowRoot.querySelector("#next-btn");
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
        // this.removeEventListener('click', this._closeModal);
    }

    _doWhenReady(){
        // Handle the close button click event
        this.shadowRoot
            .querySelector("#closeBtn")
            .addEventListener('click', () => {
                this._closeModal();
            });

        // Handle the previous button click event
        this.previousButton.addEventListener("click", () => {
            this.currentCardImageElement = this.currentCardImageElement.previousElementSibling;
            this._updatePreview();
            this._updateCtrollersVisibility();
        });

        // Handle the next button click event
        this.nextButton.addEventListener("click", () => {
            this.currentCardImageElement = this.currentCardImageElement.nextElementSibling;
            this._updatePreview();
            this._updateCtrollersVisibility();

        });
    }

    _updatePreview() {
        if (this.currentCardImageElement) {
            const { target, title, isVideo } = this.currentCardImageElement.data;
            this.loader.style.display = "grid";

            if (isVideo) {
                this.videoTarget.src = target;
                this.imageTarget.removeAttribute("src");
            } else {
                this.imageTarget.src = target;
                this.videoTarget.removeAttribute("src");
            }

            const updateContentVisibility = () => {
                this.imageTarget.hidden = isVideo;
                this.videoTarget.hidden = !isVideo;
                this.title.textContent = title;
                this.loader.style.display = "none";
            };

            this.imageTarget.onload = updateContentVisibility;
            this.videoTarget.onloadedmetadata = updateContentVisibility;
            this._updateCtrollersVisibility();
        }
    }

    _closeModal(){
        this.isVisible = false;
        this.currentCardImageElement = null;
        this.imageTarget.src = "";
        this.videoTarget.src = "";
        this.title.textContent = "";
    }

    _updateCtrollersVisibility(){

        this.currentCardImageElement.previousElementSibling
            ? this.previousButton.classList.remove("hidden")
            : this.previousButton.classList.add("hidden");

        this.currentCardImageElement.nextElementSibling
            ? this.nextButton.classList.remove("hidden")
            : this.nextButton.classList.add("hidden");

    }

}


customElements.define(ModalLightboxComponent.componentName, ModalLightboxComponent);