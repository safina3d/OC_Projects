/*
chaine --> n(n+1)/2 sous-chaines

1 recette  : 0.22s (mesuré)
50 recettes: 11.5s (mesuré)
5000 recettes : 14s (mesuré)
10000 recettes: 56s (mesuré)
20000 recettes: 215s ≈ 3.58 minutes (mesuré)
30000 recettes: 490s ≈ 8.17 minutes (mesuré)
40000 recettes: 875s ≈ 14.59 minutes (mesuré)
50000 recettes : ≈ 27.43 minutes (estimé)
100000 recettes: ≈ 108.93 minutes (estimé)
1000000 recettes: ≈ 10342.27 minutes, ≈ 172.37 hours (estimé)

fonction de régression polynomiale de degré 2 :
f(r) = 6.2e-7r^2 + 0.0028r - 0.08
 */


const punctuationRegex = /[!,.:;]/g;

export class ReversedIndex {
    static index = {};
    static createIndex(recipes) {
        console.time("CREATE INDEX");
        const index = ReversedIndex.index;
        recipes.forEach((recipe) => {
            const { id, name, description, ingredients } = recipe;
            const words = `${name} ${description} ${ingredients.map((i) => i.ingredient).join(" ")}`
                .toLowerCase()
                .replace(punctuationRegex, '')
                .split(" ");
            words.forEach((word) => {
                for (let i = 0; i < word.length; i++) {
                    for (let j = i + 1; j <= word.length; j++) {
                        const subWord = word.slice(i, j);
                        if (!index[subWord]) {
                            index[subWord] = [id];
                        } else if (!index[subWord].includes(id)) {
                            index[subWord].push(id);
                        }
                    }
                }
            });
        });
        console.timeEnd("CREATE INDEX")
    }


    static search(data, query){
        const words = query.toLowerCase().split(' ');
        const indices = words.map(word => ReversedIndex.index[word]).filter(Boolean);

        if(words.length !== indices.length){
            return [];
        }

        const intersection = indices.reduce((prev, curr) => {
            const set = new Set(curr);
            return prev.filter(index => set.has(index));
        });

        return  intersection.map(index => data[index - 1]);
    }
}