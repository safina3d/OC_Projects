import GenericComponent from '../generic-component.js';

class CardImageComponent extends GenericComponent {

    constructor() {
        super();
    }

    static get componentName() {
        return "image-card";
    }

    _doWhenReady(){
        const likeCheckboxElement = this.shadowRoot.querySelector(`#checkbox${this.data.id}`);
        const likesCountElement = this.shadowRoot.querySelector(".card__likes-count");
        const photoElement = this.shadowRoot.querySelector(".card__photo");

        // Gestion du changement d'état du bouton "like"
        likeCheckboxElement.addEventListener("change", () => {
            // Mettre à jour le nombre de likes sous la photo
            const likeValue = likeCheckboxElement.checked ? 1 : -1;
            likesCountElement.textContent = parseInt(likesCountElement.textContent) + likeValue;

            // Notifier le changement d'état du Like
            this.dispatchEvent(new CustomEvent('imageCardLikeChange', {
                detail: { value: likeCheckboxElement.checked ? 1 : -1 }
            }));
        });

        photoElement.addEventListener('click', () => {
            this._notifyImageCardPhotoSelection();
        });

        photoElement.addEventListener("keydown", (event) => {
            if (event.code === "Enter") {
                this._notifyImageCardPhotoSelection();
            }
        });

    }

    _notifyImageCardPhotoSelection(){
        this.dispatchEvent(new CustomEvent('imageCardPhotoClick', {detail: this}));
    }

}


customElements.define(CardImageComponent.componentName, CardImageComponent);