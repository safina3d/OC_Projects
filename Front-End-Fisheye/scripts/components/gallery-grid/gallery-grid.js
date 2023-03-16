import GenericComponent from '../generic-component.js';
import {CONFIGURATION} from "../../utils/config.js";

class GalleryGridComponent extends GenericComponent {

    constructor() {
        super();
    }

    get galleryElement() {
        return this.shadowRoot.querySelector('.gallery-grid');
    }

    get dropDownElement() {
        return this.shadowRoot.querySelector('drop-down');
    }

    get lightBoxModal(){
        return this.shadowRoot.querySelector('modal-lightbox');
    }

    static get componentName() {
        return "gallery-grid";
    }

    connectedCallback(){
        this.addEventListener('componentReadyEvent', this._doWhenReady);
    }

    disconnectedCallback(){
        this.removeEventListener('componentReadyEvent', this._doWhenReady);
    }

    _doWhenReady(){
        this._populate();

        this.dropDownElement.addEventListener('change', (e) => {
            this._sortGallery();
        });

        this.galleryElement.addEventListener('click', (event) => {
            event.preventDefault();
            if (event.target.tagName === 'CARD-IMAGE') {
                this.lightBoxModal.currentCardImageElement = event.target;
                this.lightBoxModal.isVisible = true;
            }
        });
    }

    _populate() {
        if(this.galleryElement && this.data) {
            const fragment = document.createDocumentFragment();
            const { mediaList, photographerId } = this.data;

            const photographerDir = CONFIGURATION.photographerDirectory[photographerId];
            const lowResDirectory = `${CONFIGURATION.lowResPhotosLocation}${photographerDir}`;
            const highResDirectory = `${CONFIGURATION.highResPhotosLocation}${photographerDir}`;

            mediaList.forEach( media => {
                const cardImageEl = document.createElement('card-image');
                const isVideo = !!media.video;
                cardImageEl.data = {
                    ...media,
                    thumbnail: `${lowResDirectory}${isVideo ? media.video.replace(/\.[^/.]+$/, '') + '.jpg' : media.image}`,
                    target: `${highResDirectory}${media.video || media.image}`,
                    isVideo
                }
                fragment.appendChild(cardImageEl);
            });

            this.galleryElement.innerHTML = '';
            this.galleryElement.appendChild(fragment);
            this._sortGallery();
        }
    }

    _sortGallery(){
        // Sort all CardImages
        const property = this.dropDownElement.value;
        const sortOrder = property === "title" ? 1 : -1;
        Array.from(this.galleryElement.children)
            .sort((cardImageA, cardImageB) =>{
                if (cardImageA.data[property] < cardImageB.data[property]) {
                    return -1 * sortOrder;
                }
                if (cardImageA.data[property] > cardImageB.data[property]) {
                    return 1 * sortOrder;
                }
                return 0;
            })
            .forEach(cardImageElement => this.galleryElement.appendChild(cardImageElement));
    }

}


customElements.define(GalleryGridComponent.componentName, GalleryGridComponent);