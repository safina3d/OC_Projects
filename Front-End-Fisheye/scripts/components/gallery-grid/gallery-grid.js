import GenericComponent from '../generic-component.js';
import { createImageCards } from "../../factories/photographer.js";

class GalleryGridComponent extends GenericComponent {

    constructor() {
        super();
    }

    static get componentName() {
        return "gallery-grid";
    }

    get galleryElement() {
        return this.shadowRoot.querySelector('.gallery-grid');
    }

    get dropDownElement() {
        return this.shadowRoot.querySelector('drop-down');
    }

    get lightBoxModal() {
        return this.shadowRoot.querySelector('modal-lightbox');
    }

    _doWhenReady() {
        this._populateWithImageCards();

        this.dropDownElement.addEventListener('change', () => {
            this._sortGallery();
        });

        this.galleryElement.addEventListener('imageCardPhotoClick', (event) => {
            event.stopPropagation();
            this.lightBoxModal.currentCardImageElement = event.detail;
        }, true);

        // Capture du changement du "like" d'une image card
        this.galleryElement.addEventListener("imageCardLikeChange", (event) => {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent('galleryGridChange', {detail: event.detail}));
        }, true)
    }

    _populateWithImageCards() {
        if(this.data) {
            this.galleryElement.appendChild(createImageCards(this.data));
            this._sortGallery();
        }
    }

    _sortGallery(){
        const sortCriterion = this.dropDownElement.selectedValue;
        const sortOrder = sortCriterion === "title" ? 1 : -1;
        Array.from(this.galleryElement.children)
            .sort((cardImageA, cardImageB) =>{
                if (cardImageA.data[sortCriterion] < cardImageB.data[sortCriterion]) {
                    return -1 * sortOrder;
                }
                if (cardImageA.data[sortCriterion] > cardImageB.data[sortCriterion]) {
                    return 1 * sortOrder;
                }
                return 0;
            })
            .forEach(cardImageElement => this.galleryElement.appendChild(cardImageElement));
    }

}


customElements.define(GalleryGridComponent.componentName, GalleryGridComponent);