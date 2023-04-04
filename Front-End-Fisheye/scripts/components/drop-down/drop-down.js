import GenericComponent from "../generic-component.js";

class DropDownComponent extends GenericComponent {

    constructor() {
        super();
        this.data = {};
        this.selectedValue = "likes";
    }

    static get componentName() {
        return "drop-down";
    }

    get customSelectRootElement() {
        return this.shadowRoot.querySelector(".custom-select");
    }

    get isExpanded() {
        return this.customSelectRootElement.classList.contains("is-expanded");
    }

    set isExpanded(state) {
        this.customSelectRootElement.classList.toggle("is-expanded", state);
    }

    _doWhenReady() {
        const headerButtonElement = this.shadowRoot.querySelector(".cs__header");
        const optionElements = this.shadowRoot.querySelectorAll(".cs__option");
        const customSelectNameElement = this.shadowRoot.querySelector("#cs__display-name");
        const optionsContainerElement = this.shadowRoot.querySelector(".cs__options-container");

        const selectOption = (event) => {
            const optionElement = event.target;
            if (optionElement.classList.contains("cs__option")) {
                // Mettre à jour l'élément sélectionné
                optionElements.forEach(el => el.setAttribute("aria-selected", "false"));
                optionsContainerElement.parentElement.setAttribute("aria-activedescendant", optionElement.id);
                customSelectNameElement.textContent = optionElement.children[0].textContent;
                optionElement.setAttribute("aria-selected", "true");
                this.selectedValue = optionElement.dataset["value"];

                // Fermer le menu déroulant
                this.isExpanded = false;
                this.dispatchEvent(new CustomEvent("change"));
            }
        }

        // Gestion de l'événement de clic sur les options
        optionsContainerElement.addEventListener("click", selectOption);

        // Gestion de l'événement de pression de la touche "Enter" sur les options
        optionsContainerElement.addEventListener("keydown", (event) => {
            if (event.code === "Enter") {
                selectOption(event);
            }
        });

        // Gestion de l'événement de clic sur le bouton d'en-tête
        headerButtonElement.addEventListener("click", () => {
            // Ouvrir ou fermer le menu déroulant
            this.isExpanded = !this.isExpanded;
            headerButtonElement.setAttribute("aria-expanded", `${this.isExpanded}`);

            // Cacher l'option déjà sélectionnée
            optionElements.forEach(el => {
                if (this.selectedValue === el.dataset["value"]) {
                    el.setAttribute("hidden", "");
                } else {
                    el.removeAttribute("hidden");
                }
            });
        });
    }

}

customElements.define(DropDownComponent.componentName, DropDownComponent);
