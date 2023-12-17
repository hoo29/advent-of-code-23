import { Heap } from "heap-js";

type Dir = "N" | "E" | "S" | "W" | "*";

type Pos = [number, number];

type HistoryValue = { count?: number; sum?: number };

type History = Map<string, HistoryValue[]>;

type Path = [Pos, Dir][];

type State = {
    pos: Pos;
    dir: Dir;
    count: number;
    sum: number;
    path: Path;
};

function hash(p: Pos, d: Dir): string {
    return "" + p[0] + "," + p[1] + "," + d;
}

const doPath = false;

function bfs(grid: number[][]): [number, Path] {
    const init: State = {
        pos: [0, 0],
        dir: "*",
        count: 0,
        sum: 0,
        path: [],
    };

    const history: History = new Map();
    let minCost = Number.MAX_SAFE_INTEGER;
    let minPath: Path = [];

    const pQueue = new Heap<State>((a, b) => a.sum - b.sum);
    pQueue.init([init]);

    for (const cur of pQueue) {
        if (typeof cur === "undefined") {
            throw new Error("why");
        }
        const { pos, dir, count, sum, path } = cur;

        // out of bounds
        if (pos[0] < 0 || pos[1] < 0 || pos[0] >= grid[0].length || pos[1] >= grid.length) {
            continue;
        }

        // straight line constraint
        if (count >= 3) {
            throw new Error("shouldn't be here");
        }

        // special case for start
        const newSum = dir === "*" ? 0 : sum + grid[pos[1]][pos[0]];
        if (doPath) {
            path.push([pos, dir]);
        }

        // end condition
        if (pos[0] === grid[0].length - 1 && pos[1] === grid.length - 1) {
            if (newSum < minCost) {
                minCost = newSum;
                minPath = path;
            }
            continue;
        }

        // trim
        if (newSum > minCost) {
            continue;
        }

        // already been here
        const key = hash(pos, dir);
        const prev: HistoryValue[] = history.get(key) ?? [{}, {}, {}];
        // check if better path
        let prevBetter = false;
        for (let i = count; i >= 0; --i) {
            if ((prev[i].sum ?? Number.MAX_SAFE_INTEGER) <= sum) {
                prevBetter = true;
                break;
            }
        }

        if (prevBetter) {
            continue;
        }

        prev[count] = {
            count,
            sum,
        };

        history.set(key, prev);

        // moves
        const newMoves: Pos[] = [
            // E
            [pos[0] + 1, pos[1]],
            // S
            [pos[0], pos[1] + 1],
            // W
            [pos[0] - 1, pos[1]],
            // N
            [pos[0], pos[1] - 1],
        ];

        for (const [ind, m] of newMoves.entries()) {
            const newDir = ind === 0 ? "E" : ind === 1 ? "S" : ind === 2 ? "W" : "N";
            const newCount = newDir === dir ? count + 1 : 0;
            if (
                count === 2 &&
                ((dir === "N" && newDir !== "E" && newDir !== "W") ||
                    (dir === "E" && newDir !== "S" && newDir !== "N") ||
                    (dir === "S" && newDir !== "E" && newDir !== "W") ||
                    (dir === "W" && newDir !== "S" && newDir !== "N"))
            ) {
                continue;
            }

            if (
                (dir === "N" && newDir === "S") ||
                (dir === "E" && newDir === "W") ||
                (dir === "S" && newDir === "N") ||
                (dir === "W" && newDir === "E")
            ) {
                continue;
            }
            pQueue.push({
                count: newCount,
                pos: m,
                sum: newSum,
                dir: newDir,
                path: doPath ? [...path] : [],
            });
        }
    }

    return [minCost, minPath];
}

export function solve17p1(input: string[]): number {
    const grid = input.map((x) => x.split("").map((x) => Number(x)));

    const solved = bfs(grid);

    if (doPath) {
        const toPrint = input.map((x) => x.split(""));

        for (const c of solved[1].slice(1)) {
            const newChar = c[1] === "N" ? "^" : c[1] === "E" ? ">" : c[1] === "S" ? "v" : "<";
            toPrint[c[0][1]][c[0][0]] = newChar;
        }

        console.log("\n");
        toPrint.forEach((l) => console.log(l.join("")));
        console.log("\n");
    }
    return solved[0];
}

function bfs2(grid: number[][]): [number, Path] {
    const init: State = {
        pos: [0, 0],
        dir: "*",
        count: 0,
        sum: 0,
        path: [],
    };

    const history: History = new Map();
    let minCost = Number.MAX_SAFE_INTEGER;
    let minPath: Path = [];

    const pQueue = new Heap<State>((a, b) => a.sum - b.sum);
    pQueue.init([init]);

    for (const cur of pQueue) {
        if (typeof cur === "undefined") {
            throw new Error("why");
        }
        const { pos, dir, count, sum, path } = cur;

        // out of bounds
        if (pos[0] < 0 || pos[1] < 0 || pos[0] >= grid[0].length || pos[1] >= grid.length) {
            continue;
        }

        // special case for start
        const newSum = dir === "*" ? 0 : sum + grid[pos[1]][pos[0]];
        if (doPath) {
            path.push([pos, dir]);
        }

        // end condition
        if (pos[0] === grid[0].length - 1 && pos[1] === grid.length - 1) {
            if (count < 3) {
                continue;
            } else {
                if (newSum < minCost) {
                    minCost = newSum;
                    minPath = path;
                }
                continue;
            }
        }

        // trim
        if (newSum >= minCost) {
            continue;
        }

        if (count >= 3) {
            // already been here
            const key = hash(pos, dir);
            const prev: HistoryValue[] = history.get(key) ?? [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

            // check if better path
            let prevBetter = false;
            for (let i = count; i >= 0; --i) {
                if ((prev[i].sum ?? Number.MAX_SAFE_INTEGER) <= sum) {
                    prevBetter = true;
                    break;
                }
            }

            if (prevBetter) {
                continue;
            }

            prev[count] = {
                count,
                sum,
            };
            history.set(key, prev);
        }

        // moves
        const newMoves: Pos[] = [
            // E
            [pos[0] + 1, pos[1]],
            // S
            [pos[0], pos[1] + 1],
            // W
            [pos[0] - 1, pos[1]],
            // N
            [pos[0], pos[1] - 1],
        ];

        for (const [ind, m] of newMoves.entries()) {
            const newDir = ind === 0 ? "E" : ind === 1 ? "S" : ind === 2 ? "W" : "N";
            const newCount = newDir === dir ? count + 1 : 0;
            if (count < 3 && newDir !== dir && dir !== "*") {
                continue;
            }

            if (newCount >= 10) {
                continue;
            }

            if (
                (dir === "N" && newDir === "S") ||
                (dir === "E" && newDir === "W") ||
                (dir === "S" && newDir === "N") ||
                (dir === "W" && newDir === "E")
            ) {
                continue;
            }
            pQueue.push({
                count: newCount,
                pos: m,
                sum: newSum,
                dir: newDir,
                path: doPath ? [...path] : [],
            });
        }
    }

    return [minCost, minPath];
}

export function solve17p2(input: string[]): number {
    const grid = input.map((x) => x.split("").map((x) => Number(x)));

    const solved = bfs2(grid);

    if (doPath) {
        const toPrint = input.map((x) => x.split(""));

        for (const c of solved[1].slice(1)) {
            const newChar = c[1] === "N" ? "^" : c[1] === "E" ? ">" : c[1] === "S" ? "v" : "<";
            toPrint[c[0][1]][c[0][0]] = newChar;
        }

        console.log("\n");
        toPrint.forEach((l) => console.log(l.join("")));
        console.log("\n");
    }
    return solved[0];
}
