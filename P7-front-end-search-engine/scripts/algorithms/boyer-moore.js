export class BoyerMoore {
    static search(text, pattern) {
        const patternLength = pattern.length;
        const lastPatternIndex = patternLength - 1;

        // Calculer la table de décalage pour chaque caractère du pattern
        const table = new Array(256).fill(patternLength);
        for (let i = 0; i < lastPatternIndex; i++) {
            table[pattern.charCodeAt(i)] = lastPatternIndex - i;
        }

        // Commencer la recherche en comparant les caractères de droite à gauche
        let currentTextIndex = lastPatternIndex;
        let currentPatternIndex = lastPatternIndex;

        while (currentPatternIndex >= 0 && currentTextIndex < text.length) {
            if (pattern[currentPatternIndex] === text[currentTextIndex]) {
                // Si les caractères correspondent, continuer la comparaison
                currentPatternIndex--;
                currentTextIndex--;
            } else {
                // Sinon, utiliser la table de décalage pour sauter des caractères
                const skip = table[text.charCodeAt(currentTextIndex)] || patternLength;
                currentTextIndex += skip;
                currentPatternIndex = lastPatternIndex;
            }
        }

        // Si on a trouvé une correspondance, renvoyer l'index dans le texte
        return currentPatternIndex < 0;
    }
}

