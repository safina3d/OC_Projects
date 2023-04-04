class GenericComponent extends HTMLElement {
    constructor() {
        super();
        // Créer un Shadow DOM pour encapsuler le style et le contenu HTML
        this.attachShadow({ mode: "open" });

        // Récupérer les chemins vers les fichiers HTML et CSS depuis la classe enfant
        this._htmlFile = `${this.componentFilePath}.html`;
        this._cssFile = `${this.componentFilePath}.css`;
        this._htmlFileFallback = `${this.componentFilePath}-fallback.html`;
    }
    
    get htmlTemplateFile() {
        return this._htmlFile;
    }

    set htmlTemplateFile(value) {
        this._htmlFile = value;
        this._updateComponent();
    }

    get cssFile() {
        return this._cssFile;
    }

    set cssFile(value) {
        this._cssFile = value;
        this._updateComponent();
    }

    get componentFilePath(){
        // Renvoie le chemin d'accès complet du fichier de composant
        const { componentName } = this.constructor;
        return new URL(`${componentName}/${componentName}`, import.meta.url).pathname;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._updateComponent();
    }

    get useFallBackTemplate() {
        return this.hasAttribute("use-fallback");
    }

    set useFallBackTemplate(state) {
        this.toggleAttribute("use-fallback", state);
        this._updateComponent();
    }

    connectedCallback() {
        this.addEventListener("componentReadyEvent", this._doWhenReady);
    }

    disconnectedCallback(){
        this.removeEventListener("componentReadyEvent", this._doWhenReady);
    }

    async _updateComponent() {
        try {
            // const htmlFile = this.useFallBackTemplate && !this.data ? this._htmlFileFallback : this._htmlFile;

            // Récupérer le contenu du fichier HTML et du fichier CSS
            const htmlFile = this.useFallBackTemplate ? this._htmlFileFallback : this._htmlFile;

            const [html, css] = await Promise.all([
                fetch(htmlFile).then(response => response.text()),
                fetch(this._cssFile).then(response => response.text())
            ]);

            // Injecter le contenu HTML et le CSS dans le Shadow DOM
            this.shadowRoot.innerHTML = this.data
                ? html.replace(/{(\w+)}/g, (match, property) => this.data[property] ?? "")
                : html;

            const styleElement = document.createElement("style");
            styleElement.textContent = css;
            this.shadowRoot.prepend(styleElement);

            this.dispatchEvent(new Event("componentReadyEvent"));

        } catch (error) {
            console.error(error);
        }
    }

}

export default GenericComponent;
