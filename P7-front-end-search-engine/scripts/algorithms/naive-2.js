export class NaiveOldSearch {
    static search(text, pattern) {
        return NaiveOldSearch.compareStrings(text, pattern);
    }

    // Comparaison caractère par caractère
    static compareStrings(str1, str2) {
        str1 = str1.toLowerCase();
        str2 = str2.toLowerCase();

        for (let i = 0; i < str1.length; i++) {
            for (let j = 0; j < str2.length; j++) {
                if (str1[i + j] !== str2[j]) {
                    break;
                }
                if (j === str2.length - 1) {
                    return true;
                }
            }
        }

        return false;
    }
}
