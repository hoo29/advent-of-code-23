export function solve04p1(input: string[]): number {
    let ans = 0;
    for (const line of input) {
        const results = line.split(":")[1];

        const winning = results
            .split("|")[0]
            .trim()
            .split(" ")
            .filter((val) => val);
        const mine = results
            .split("|")[1]
            .trim()
            .split(" ")
            .filter((val) => val);

        const overlap = mine.filter((val) => winning.includes(val)).length;
        if (overlap > 0) {
            ans += Math.pow(2, overlap - 1);
        }
    }

    return ans;
}

export function solve04p2(input: string[]): number {
    let ans = 0;
    const cards = JSON.parse(JSON.stringify(input)) as string[];
    const winners: Map<number, number> = new Map();
    while (cards.length > 0) {
        const line = cards.shift();
        if (typeof line === "undefined") {
            throw new Error("hmmm");
        }
        const id = Number(
            line
                .split(":")[0]
                .split(" ")
                .filter((val) => val)[1]
        );
        const results = line.split(":")[1];

        const winning = results
            .split("|")[0]
            .trim()
            .split(" ")
            .filter((val) => val);
        const mine = results
            .split("|")[1]
            .trim()
            .split(" ")
            .filter((val) => val);

        const overlap = mine.filter((val) => winning.includes(val)).length;
        winners.set(id, (winners.get(id) ?? 0) + 1);
        for (let ind = 0; ind < overlap; ++ind) {
            const winningCard = input[id + ind];
            const winningCardId = Number(
                winningCard
                    .split(":")[0]
                    .split(" ")
                    .filter((val) => val)[1]
            );
            let newValue = winners.get(winningCardId) ?? 0;
            newValue += overlap === 0 ? 0 : winners.get(id) ?? 0;
            winners.set(winningCardId, newValue);
        }
    }

    for (const val of winners.values()) {
        ans += val;
    }

    return ans;
}
