export class NaiveSearch {

    static search(text, pattern) {
        return text.toLowerCase().includes(pattern.toLowerCase());
    }
}