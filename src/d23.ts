import assert from "assert";
import { Heap } from "heap-js";
import fs from "fs";
import path from "path";

type Pos = [number, number];

type State = {
    pos: Pos;
    steps: number;
    history: Set<string>;
};

type Edge = {
    weight: number;
    from: Node;
    to: Node;
    history: Set<string>;
};

type Node = {
    name: string;
    pos: Pos;
    to: Edge[];
    from: Edge[];
    depth: number;
};

function hash(pos: Pos) {
    return `${pos[0]},${pos[1]}`;
}

export function solve23p1(input: string[]): number {
    const cache = new Map<string, number>();
    const startInd = input[0].indexOf(".");
    const start: State = {
        pos: [startInd, 0],
        steps: 0,
        history: new Set(),
    };

    const end: Pos = [input.at(-1)!.indexOf("."), input.length - 1];

    const pQueue = new Heap<State>((a, b) => Heap.maxComparatorNumber(a.steps, b.steps));
    pQueue.init([start]);

    let max = Number.MIN_SAFE_INTEGER;

    for (const cur of pQueue) {
        assert(cur);
        const { pos, steps } = cur;
        const x = pos[0];
        const y = pos[1];

        if (x < 0 || y < 0 || x >= input[0].length || y >= input.length) {
            continue;
        }

        const char = input[y][x];
        if (char === "#") {
            continue;
        }

        if (x === end[0] && y === end[1] && steps > max) {
            max = steps;
            continue;
        }
        const key = hash(cur.pos);

        if (cur.history.has(key)) {
            continue;
        }

        cur.history.add(key);

        const prev = cache.get(key) ?? 0;
        // if (prev > steps) {
        //     continue;
        // }

        cache.set(key, steps);
        // console.log(key);

        const newMoves: Pos[] = [];
        if ([">", "."].includes(char)) {
            newMoves.push([x + 1, y]);
        }

        if (["v", "."].includes(char)) {
            newMoves.push([x, y + 1]);
        }

        if (["<", "."].includes(char)) {
            newMoves.push([x - 1, y]);
        }

        if (["^", "."].includes(char)) {
            newMoves.push([x, y - 1]);
        }

        newMoves.forEach((m) =>
            pQueue.push({
                pos: m,
                steps: steps + 1,
                history: new Set([...cur.history]),
            })
        );
    }

    return max;
}

function doStuff(start: Pos, end: Pos, input: string[]) {
    const queue: State[] = [];
    const startState: State = { pos: start, steps: 0, history: new Set() };
    queue.push(startState);

    const result: State[] = [];

    while (queue.length > 0) {
        const cur = queue.shift();
        assert(cur);

        const { pos, steps } = cur;
        const x = pos[0];
        const y = pos[1];

        if (x < 0 || y < 0 || x >= input[0].length || y >= input.length) {
            continue;
        }

        const char = input[y][x];
        if (char === "#") {
            continue;
        }
        const key = hash(cur.pos);

        if (cur.history.has(key)) {
            continue;
        }

        if (x === end[0] && y === end[1]) {
            result.push(cur);
            continue;
        }

        const newMoves: Pos[] = [
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
            [x, y - 1],
        ];
        const count = newMoves.filter(
            (p) =>
                p[1] > 1 &&
                p[0] > 1 &&
                p[1] < input.length - 1 &&
                p[0] < input[0].length - 1 &&
                input[p[1]][p[0]] !== "#"
        ).length;

        if (!(start[0] === x && start[1] === y) && count > 2) {
            result.push(cur);
            continue;
        }

        cur.history.add(key);

        newMoves.forEach((m) =>
            queue.push({
                pos: m,
                steps: steps + 1,
                history: new Set([...cur.history]),
            })
        );
    }

    return result;
}

export function solve23p2(input: string[]): number {
    const startInd = input[0].indexOf(".");
    const start: State = {
        pos: [startInd, 0],
        steps: 0,
        history: new Set(),
    };
    const grid = input.map((v) => v.split(""));

    const end: Pos = [input.at(-1)!.indexOf("."), input.length - 1];

    const allJunctions: Pos[] = [];
    for (let y = 1; y < input.length - 1; ++y) {
        const l = input[y];
        for (let x = 1; x < l.length - 1; ++x) {
            if (l[x] === "#") {
                continue;
            }
            const newMoves: Pos[] = [
                [x + 1, y],
                [x, y + 1],
                [x - 1, y],
                [x, y - 1],
            ];
            const count = newMoves.filter((p) => input[p[1]][p[0]] !== "#").length;
            if (count > 2) {
                allJunctions.push([x, y]);
            }
        }
    }

    const graph = new Map<string, Node>();
    for (const pos of [start.pos, ...allJunctions]) {
        const name = hash(pos);
        const source: Node = graph.get(name) ?? { name, from: [], to: [], pos, depth: Number.MAX_SAFE_INTEGER };
        const dests = doStuff(pos, end, input);
        if (dests.some((d) => d.pos[0] === end[0] && d.pos[1] === end[1])) {
            console.log("filter end", pos);
            dests.filter((d) => d.pos[0] === end[0] && d.pos[1] === end[1]);
        }
        const destsMap = new Map<string, State>();
        for (const d of dests) {
            const dname = hash(d.pos);
            const ex = destsMap.get(dname);
            if (typeof ex === "undefined" || ex.steps < d.steps) {
                destsMap.set(dname, d);
            }
        }

        for (const d of destsMap.values()) {
            const destName = hash(d.pos);
            const dest: Node = graph.get(destName) ?? {
                name: destName,
                from: [],
                to: [],
                pos: d.pos,
                depth: Number.MAX_SAFE_INTEGER,
            };
            source.to.push({ from: source, to: dest, weight: d.steps, history: d.history });
            dest.from.push({ from: source, to: dest, weight: d.steps, history: d.history });
            graph.set(destName, dest);
        }

        graph.set(name, source);
    }

    const depthQueue: Node[] = [];
    const startNode = graph.get(hash(start.pos))!;
    startNode.depth = 0;
    depthQueue.push(startNode);
    const visited = new Set<string>();
    while (depthQueue.length > 0) {
        const cur = depthQueue.shift();
        assert(cur);
        if (visited.has(cur.name)) {
            continue;
        }
        visited.add(cur.name);
        for (const o of cur.to) {
            if (o.to.depth > cur.depth) {
                o.to.depth = cur.depth + 1;
            }
            depthQueue.push(o.to);
        }
    }
    const dot = path.join(__dirname, "..", "data", "days", "23", "input.dot");

    fs.writeFileSync(dot, "strict digraph {\n");

    const betterName = (x: string, n: Node) => `"${x}-d${n.depth}" `;
    for (const [k, v] of graph.entries()) {
        let better: string = "  ";
        const nodeName = betterName(k, v);
        better += nodeName;
        better += " -> ";
        better += "{";
        v.to.forEach((cv) => (better += betterName(cv.to.name, cv.to)));
        better += "}";

        fs.appendFileSync(dot, better);
        fs.appendFileSync(dot, "\n");
    }
    fs.appendFileSync(dot, "}\n");

    let max = Number.MIN_SAFE_INTEGER;
    // let maxPath = new Set<string>();

    const seen = new Set<string>();
    const dfs = (pos: Pos, visited: Set<string>, steps: number) => {
        const node = graph.get(hash(pos))!;

        if (node.pos[0] === end[0] && node.pos[1] === end[1]) {
            if (steps > max) {
                max = steps;
            }
        }
        const key = hash(pos);
        if (visited.has(key)) {
            return;
        }
        visited.add(key);
        for (const n of node.to) {
            dfs(n.to.pos, visited, steps + n.weight);
        }
        visited.delete(key);
    };

    dfs(start.pos, seen, 0);

    // for (const a of Array.from(maxPath)) {
    //     const b = a.split(",").map((c) => Number(c));
    //     grid[b[1]][b[0]] = "O";
    // }

    // grid[0][startInd] = "S";

    // console.log("\n");
    // grid.forEach((l) => console.log(l.join("")));
    // console.log("\n");

    return max;
}
