type Hand = {
    cards: string;
    bid: number;
};

type CamelCards = {
    fiveKind: Hand[];
    fourKind: Hand[];
    fullHouse: Hand[];
    threeKind: Hand[];
    twoPair: Hand[];
    onePair: Hand[];
    highCard: Hand[];
};

type Count = {
    [card: string]: number;
};

function rankHand(hand: Hand): keyof CamelCards {
    const cards = hand.cards;
    const count: Count = {};
    cards.split("").forEach((c) => (count[c] = (count[c] ?? 0) + 1));

    const keys = Object.keys(count);
    const values = Object.values(count);
    if (keys.length === 1) {
        return "fiveKind";
    } else if (keys.length === 2 && values.includes(4)) {
        return "fourKind";
    } else if (keys.length === 2) {
        return "fullHouse";
    } else if (keys.length === 3 && values.includes(3)) {
        return "threeKind";
    } else if (keys.length === 3) {
        return "twoPair";
    } else if (keys.length === 4) {
        return "onePair";
    } else {
        return "highCard";
    }
}

function cardToNum(card: string, p2: boolean = false): number {
    if (!Number.isNaN(Number(card))) {
        return Number(card);
    }

    switch (card) {
        case "A":
            return 14;
        case "K":
            return 13;
        case "Q":
            return 12;
        case "J":
            return p2 ? 1 : 11;
        case "T":
            return 10;
        default:
            throw new Error("Oh no");
    }
}

export function solve07p1(input: string[]): number {
    const results: CamelCards = {
        fiveKind: [],
        fourKind: [],
        fullHouse: [],
        threeKind: [],
        twoPair: [],
        onePair: [],
        highCard: [],
    };

    for (const line of input) {
        const hand: Hand = {
            bid: Number(line.split(" ")[1]),
            cards: line.split(" ")[0],
        };
        const rank = rankHand(hand);
        results[rank].push(hand);
    }

    Object.values(results).forEach((result) =>
        result.sort((a, b) => {
            for (let i = 0; i < a.cards.length; ++i) {
                const diff = cardToNum(a.cards[i]) - cardToNum(b.cards[i]);
                if (diff !== 0) {
                    return diff;
                }
            }
            return 0;
        })
    );

    const allHandsSorted = [
        ...results.highCard,
        ...results.onePair,
        ...results.twoPair,
        ...results.threeKind,
        ...results.fullHouse,
        ...results.fourKind,
        ...results.fiveKind,
    ];

    return allHandsSorted.reduce((acc, val, ind) => (acc += val.bid * (ind + 1)), 0);
}

function rankHandP2(hand: Hand): keyof CamelCards {
    const cards = hand.cards;
    const count: Count = {};
    let jokerCount = 0;
    cards.split("").forEach((c) => {
        if (c !== "J") {
            count[c] = (count[c] ?? 0) + 1;
        } else {
            ++jokerCount;
        }
    });

    const keys = Object.keys(count);
    const values = Object.values(count);
    values.sort((a, b) => b - a);
    values[0] += jokerCount;

    if (keys.length === 1 || keys.length === 0) {
        return "fiveKind";
    } else if (keys.length === 2 && values.includes(4)) {
        return "fourKind";
    } else if (keys.length === 2) {
        return "fullHouse";
    } else if (keys.length === 3 && values.includes(3)) {
        return "threeKind";
    } else if (keys.length === 3) {
        return "twoPair";
    } else if (keys.length === 4) {
        return "onePair";
    } else {
        return "highCard";
    }
}

export function solve07p2(input: string[]): number {
    const results: CamelCards = {
        fiveKind: [],
        fourKind: [],
        fullHouse: [],
        threeKind: [],
        twoPair: [],
        onePair: [],
        highCard: [],
    };

    for (const line of input) {
        const hand: Hand = {
            bid: Number(line.split(" ")[1]),
            cards: line.split(" ")[0],
        };
        const rank = rankHandP2(hand);
        results[rank].push(hand);
    }

    Object.values(results).forEach((result) =>
        result.sort((a, b) => {
            for (let i = 0; i < a.cards.length; ++i) {
                const diff = cardToNum(a.cards[i], true) - cardToNum(b.cards[i], true);
                if (diff !== 0) {
                    return diff;
                }
            }
            return 0;
        })
    );

    const allHandsSorted = [
        ...results.highCard,
        ...results.onePair,
        ...results.twoPair,
        ...results.threeKind,
        ...results.fullHouse,
        ...results.fourKind,
        ...results.fiveKind,
    ];

    return allHandsSorted.reduce((acc, val, ind) => (acc += val.bid * (ind + 1)), 0);
}
