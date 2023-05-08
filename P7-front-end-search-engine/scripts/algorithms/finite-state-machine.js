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
        const patternLength = this.pattern.length;
        const tableSize = patternLength + 1;
        this.transitionTable = Array.from({ length: tableSize }, () => ({}));

        this.transitionTable[0][this.pattern[0]] = 1;

        let activeStateIndex = 0;
        for (let nextStateIndex = 1; nextStateIndex < tableSize; nextStateIndex++) {
            this.transitionTable[nextStateIndex] = { ...this.transitionTable[activeStateIndex] };

            if (nextStateIndex < patternLength) {
                const character = this.pattern[nextStateIndex];
                this._setNextState(nextStateIndex, character);

                activeStateIndex = this._getStateIndex(activeStateIndex, character);
            }
        }
    }

    _getStateIndex(stateIndex, character) {
        const nextState = this.transitionTable[stateIndex][character];
        return nextState !== undefined ? nextState : 0;
    }

    _setNextState(nextStateIndex, character) {
        this.transitionTable[nextStateIndex][character] = nextStateIndex + 1;
    }

    search(text) {
        const patternLength = this.pattern.length;
        const textLength = text.length;

        let currentState = 0;
        for (let i = 0; i < textLength; i++) {
            currentState = this._getStateIndex(currentState, text[i]);
            if (currentState === patternLength) {
                return true;
            }
        }
        return false;
    }
}
