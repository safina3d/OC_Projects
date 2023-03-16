import GenericComponent from '../generic-component.js';

class DropDownComponent extends GenericComponent {

    constructor() {
        super();
        this.tabIndex = 0;
        this.data = {};
    }

    get value() {
        return this._value;
    }

    set value(newValue) {
        if (newValue !== this._value){
            this._value = newValue;
        }
    }

    static get componentName() {
        return "drop-down";
    }

    connectedCallback(){
        this.addEventListener('componentReadyEvent', this._doWhenReady);
    }

    disconnectedCallback(){
        this.removeEventListener('componentReadyEvent', this._doWhenReady);
    }

    _doWhenReady(){
        const selectElement = this.shadowRoot.querySelector('#select');
        const selectedItemContainer = this.shadowRoot.querySelector('#selected-item');
        const optionListContainer = this.shadowRoot.querySelector('#option-list');

        this._populate(selectedItemContainer, optionListContainer);

        selectElement.addEventListener('click', () => {
            optionListContainer.classList.toggle("hidden");
        });

    }

    _populate(selectedItemContainer, optionListContainer){

        const assignedNodes = this.shadowRoot
            .querySelector('slot')
            .assignedNodes()
            .filter(node => node.nodeType === Node.ELEMENT_NODE);

        if (assignedNodes) {

            const fragment = document.createDocumentFragment();
            // Add event listener to all option nodes
            assignedNodes.forEach(optionNode => {
                optionNode.addEventListener('click', () => {
                    this._updateSelectedItem(optionNode, selectedItemContainer);
                    optionListContainer.classList.toggle("hidden");
                    this.dispatchEvent(new CustomEvent('change'));

                });
                fragment.appendChild(optionNode);
            });

            optionListContainer.appendChild(fragment);

            // Set first value as selected
            this._updateSelectedItem(assignedNodes[0], selectedItemContainer);
            this.dispatchEvent(new CustomEvent('change'))
        }
    }

    _updateSelectedItem(node, selectedItemContainer) {
        this.value = node.getAttribute('value');
        selectedItemContainer.textContent = node.textContent;
    }
}


customElements.define(DropDownComponent.componentName, DropDownComponent);
