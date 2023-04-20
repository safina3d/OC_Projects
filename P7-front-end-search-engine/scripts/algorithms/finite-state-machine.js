export class AutomatonSearch {
    static singleton = null;

    constructor(pattern) {
        if (!AutomatonSearch.singleton || AutomatonSearch.singleton.pattern !== pattern) {
            this.pattern = pattern;
            this._buildTransitionTable();

            AutomatonSearch.singleton = this;
        }

        return AutomatonSearch.singleton;
    }

    _buildTransitionTable() {
        // Initialisation de la table de transition.
        const patternLength = this.pattern.length;
        const tableSize = patternLength + 1;
        this.transitionTable = Array.from({ length: tableSize }, () => ({}));

        // Mise à jour de la première transition.
        this.transitionTable[0][this.pattern[0]] = 1;

        // Construction du reste de la table de transition
        let activeStateIndex = 0;
        for (let nextStateIndex = 1; nextStateIndex < tableSize; nextStateIndex++) {
            // Copier les transitions de l'état courant
            this.transitionTable[nextStateIndex] = { ...this.transitionTable[activeStateIndex] };

            // Ajout d'une nouvelle transition pour le caractère actuel
            if (nextStateIndex < patternLength) {
                // Déterminer l'état suivant pour le caractère actuel
                const character = this.pattern[nextStateIndex];
                this._setNextState(nextStateIndex, character);

                // Mise à jour de l'état courant
                activeStateIndex = this._getStateIndex(activeStateIndex, character);
            }
        }
    }

    _getStateIndex(stateIndex, character) {
        return this.transitionTable[stateIndex][character] || 0;
    }

    _setNextState(nextStateIndex, character) {
        this.transitionTable[nextStateIndex][character] = nextStateIndex + 1;
    }


    search(text) {
        const patternLength = this.pattern.length;
        const textLength = text.length;

        let currentState = 0;
        for (let i = 0; i < textLength; i++) {
            // currentState = this.transitionTable[currentState][text.charAt(i)] || 0;
            currentState = this._getStateIndex(currentState, text[i]);
            if (currentState === patternLength) {
                return true;
            }
        }
        return false;
    }
}