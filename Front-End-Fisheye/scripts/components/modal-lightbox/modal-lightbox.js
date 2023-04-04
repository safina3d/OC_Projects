import GenericComponent from '../generic-component.js';

class ModalLightboxComponent extends GenericComponent {

    constructor() {
        super();
        this.data = {};
    }

    static get componentName() {
        return 'modal-lightbox';
    }

    get isVisible(){
        return !this.hasAttribute('hidden');
    }

    set isVisible(state) {
        this.toggleAttribute('hidden', !state);
        if (state) {
            this.elements.lightboxModalElement.focus();
        }
    }

    get currentCardImageElement(){
        return this._currentCardImageElement;
    }

    set currentCardImageElement(newValue){
        if(newValue){
            this._currentCardImageElement = newValue;
            this._updateModalContent();
        }
    }

    _fetchElements() {
        this.elements = {
            lightboxModalElement: this.shadowRoot.querySelector("#lightbox-modal"),
            closeButtonElement : this.shadowRoot.querySelector("#close-btn"),
            previousButtonElement : this.shadowRoot.querySelector('#previous-btn'),
            nextButtonElement : this.shadowRoot.querySelector('#next-btn'),
            photoTitleElement : this.shadowRoot.querySelector('#photo-title'),
            imageTargetElement : this.shadowRoot.querySelector('#target-image'),
            videoTargetElement : this.shadowRoot.querySelector('#target-video'),
            loaderElement : this.shadowRoot.querySelector('#loader')
        }
    }

    _doWhenReady(){
        // Récupération des éléments du DOM
        this._fetchElements();
        const { previousButtonElement, nextButtonElement, closeButtonElement, lightboxModalElement } = this.elements;
        // lightboxModalElement.focus();

        // Gestion de la fermeture de la fenêtre modale
        closeButtonElement.addEventListener('click', () => this._resetModalState());

        closeButtonElement.addEventListener("keydown", (event) => {
            if (event.code === "Enter") {
                this._resetModalState();
            }
        });

        previousButtonElement.addEventListener("click", () => {
            this.currentCardImageElement = this.currentCardImageElement.previousElementSibling;
            this._updateControllersVisibility();
        });

        nextButtonElement.addEventListener("click", () => {
            this.currentCardImageElement = this.currentCardImageElement.nextElementSibling;
            this._updateControllersVisibility();
        });

        // Gestion des touches fléchées gauche et droite
        lightboxModalElement.addEventListener("keydown", (event) => {
            if  (this.isVisible) {
                if (event.code === 'ArrowLeft') {
                    this.currentCardImageElement = this.currentCardImageElement.previousElementSibling;
                    this._updateControllersVisibility();
                } else if (event.code === 'ArrowRight') {
                    this.currentCardImageElement = this.currentCardImageElement.nextElementSibling;
                    this._updateControllersVisibility();
                }
            }
        });
    }

    _updateModalContent() {
        if (this.currentCardImageElement) {
            const { imageTargetElement, videoTargetElement, photoTitleElement, loaderElement } = this.elements;
            const { target, title, isVideo } = this.currentCardImageElement.data;
            // Afficher le loader
            loaderElement.classList.remove("hidden");

            const updateElementsState = () => {
                imageTargetElement.hidden = isVideo;
                videoTargetElement.hidden = !isVideo;
                photoTitleElement.textContent = title;
                loaderElement.classList.add("hidden");
                if (!this.isVisible) {
                    this.isVisible = true;
                }
            };

            // Mise à jour des elements en fonction du type de contenu (image ou vidéo)
            if (isVideo) {
                videoTargetElement.src = target;
                videoTargetElement.onloadedmetadata = updateElementsState;
                imageTargetElement.removeAttribute("src");
            } else {
                imageTargetElement.src = target;
                imageTargetElement.onload = updateElementsState;
                videoTargetElement.removeAttribute("src");
            }

            // Mise à jour de la visibilité des boutons de navigation
            this._updateControllersVisibility();
        }
    }

    _updateControllersVisibility() {
        const {previousButtonElement, nextButtonElement} = this.elements;
        previousButtonElement.classList.toggle("hidden", !this.currentCardImageElement.previousElementSibling);
        nextButtonElement.classList.toggle("hidden", !this.currentCardImageElement.nextElementSibling);
    }

    _resetModalState(){
        this.elements.imageTargetElement.src = "";
        this.elements.videoTargetElement.src = "";
        this.elements.photoTitleElement.textContent = "";
        this.currentCardImageElement = null;
        this.isVisible = false;
    }

}


customElements.define(ModalLightboxComponent.componentName, ModalLightboxComponent);