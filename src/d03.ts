function cellIsAdjacent(x: number, y: number, input: string[]): boolean {
    const cordsToCheck = [
        [y - 1, x - 1],
        [y - 1, x],
        [y - 1, x + 1],
        [y, x - 1],
        [y, x + 1],
        [y + 1, x - 1],
        [y + 1, x],
        [y + 1, x + 1],
    ].filter((cord) => cord[0] >= 0 && cord[0] < input.length && cord[1] >= 0 && cord[1] < input[cord[0]].length);

    for (const cord of cordsToCheck) {
        const val = input[cord[0]][cord[1]];
        if (Number.isNaN(Number(val)) && val !== ".") {
            return true;
        }
    }

    return false;
}

export function solve03p1(input: string[]): number {
    let ans = 0;

    for (let y = 0; y < input.length; ++y) {
        let curNum = 0;
        let adjacent = false;
        for (let x = 0; x < input[y].length; ++x) {
            const cell = Number(input[y][x]);

            if (!Number.isNaN(cell)) {
                if (!adjacent) {
                    adjacent = cellIsAdjacent(x, y, input);
                }
                curNum = curNum * 10 + cell;
            }

            if (Number.isNaN(cell) || x === input[y].length - 1) {
                if (adjacent) {
                    ans += curNum;
                    adjacent = false;
                }
                curNum = 0;
            }
        }
    }
    return ans;
}

function cellStarAdjacent(x: number, y: number, input: string[]): number[][] {
    const cordsToCheck = [
        [y - 1, x - 1],
        [y - 1, x],
        [y - 1, x + 1],
        [y, x - 1],
        [y, x + 1],
        [y + 1, x - 1],
        [y + 1, x],
        [y + 1, x + 1],
    ].filter((cord) => cord[0] >= 0 && cord[0] < input.length && cord[1] >= 0 && cord[1] < input[cord[0]].length);

    const stars: number[][] = [];
    for (const cord of cordsToCheck) {
        const val = input[cord[0]][cord[1]];
        if (val === "*") {
            stars.push(cord);
        }
    }

    return stars;
}

export function solve03p2(input: string[]): number {
    let ans = 0;

    const starMap: Map<number, number[]> = new Map();
    for (let y = 0; y < input.length; ++y) {
        let curNum = 0;
        let curNumStars: number[][] = [];
        for (let x = 0; x < input[y].length; ++x) {
            const cell = Number(input[y][x]);

            if (!Number.isNaN(cell)) {
                const adjacentStars = cellStarAdjacent(x, y, input);
                // idk
                for (const adjacentStar of adjacentStars) {
                    if (!curNumStars.some((star) => star[0] === adjacentStar[0] && star[1] === adjacentStar[1])) {
                        curNumStars.push(adjacentStar);
                    }
                }
                curNum = curNum * 10 + cell;
            }

            if (Number.isNaN(cell) || x === input[y].length - 1) {
                for (const curNumStar of curNumStars) {
                    const key = curNumStar[0] * 1000 + curNumStar[1];
                    const value = starMap.get(key) ?? [];
                    value.push(curNum);
                    starMap.set(key, value);
                }
                curNum = 0;
                curNumStars = [];
            }
        }
    }

    for (const [, v] of starMap) {
        if (v.length === 2) {
            ans += v[0] * v[1];
        }
    }
    return ans;
}
