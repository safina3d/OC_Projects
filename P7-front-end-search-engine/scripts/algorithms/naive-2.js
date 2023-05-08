export class NaiveOldSearch {
    static search(text, pattern) {
            for (let i = 0; i < text.length; i++) {
                for (let j = 0; j < pattern.length; j++) {
                    if (text[i + j] !== pattern[j]) {
                        break;
                    }
                    if (j === pattern.length - 1) {
                        return true;
                    }
                }
            }

            return false;
    }
}
