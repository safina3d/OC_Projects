export class BoyerMoore {

    static search(text, pattern) {
        const textLength = text.length;
        const patternLength = pattern.length;
        const lastPatternIndex = patternLength - 1;

        // Création du tableau des décalages
        const offsetTable = [];
        for (let i = 0; i < lastPatternIndex; i++) {
            offsetTable[pattern.charCodeAt(i)] = lastPatternIndex - i;
        }

        let matchFound;
        let i = lastPatternIndex;

        while (i < textLength) {
            matchFound = true;

            // Vérification de la correspondance partielle
            for (let j = 0; j < lastPatternIndex; j++) {
                if (text[i - j] !== pattern[lastPatternIndex - j]) {
                    matchFound = false;
                    break;
                }
            }

            if (matchFound) {
                return true;
            }

            // Mise à jour de l'index en utilisant le tableau des décalages
            i += offsetTable[text.charCodeAt(i)] || patternLength;
        }

        return false;
    }
}