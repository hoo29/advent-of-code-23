import assert from "assert/strict";

type Coord = [number, number];

type State = {
    pos: Coord;
    steps: number;
};

type State2 = State & {
    wrapped?: Coord;
};

function hash(state: State) {
    return `${state.pos[0]},${state.pos[1]},${state.steps}`;
}

export function solve21p1(input: string[]): number {
    const queue: State[] = [];
    const seen = new Set<string>();

    let start: Coord | undefined = undefined;
    for (const [y, l] of input.entries()) {
        const x = l.indexOf("S");
        if (x !== -1) {
            start = [x, y];
            break;
        }
    }

    assert(start);

    queue.push({ pos: start, steps: 0 });

    const steps = 64;
    const endPos: Coord[] = [];
    while (queue.length > 0) {
        const cur = queue.shift();
        assert(cur);

        const x = cur.pos[0];
        const y = cur.pos[1];
        if (x < 0 || y < 0 || y >= input.length || x >= input[y].length || input[y][x] === "#") {
            continue;
        }

        const key = hash(cur);
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);

        if (cur.steps === steps) {
            endPos.push(cur.pos);
            continue;
        }

        const toCheck: Coord[] = [
            [x, y - 1],
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
        ];

        toCheck.forEach((c) => queue.push({ pos: c, steps: cur.steps + 1 }));
    }

    return endPos.length;
}

function solve(input: string[], start: Coord, steps: number) {
    const queue: State2[] = [];
    const seen = new Set<string>();
    queue.push({ pos: start, steps: 0 });

    let total = 0;

    while (queue.length > 0) {
        const cur = queue.shift();
        assert(cur);

        const y = cur.pos[1];
        const x = cur.pos[0];

        const wy = ((y % input.length) + input.length) % input.length;
        const wx = ((x % input[wy].length) + input[wy].length) % input[wy].length;

        if (input[wy][wx] === "#") {
            continue;
        }

        const key = `${cur.pos[0]},${cur.pos[1]}`;
        if (seen.has(key)) {
            continue;
        }
        seen.add(key);

        if (cur.steps % 2 === steps % 2) {
            ++total;
        }

        if (cur.steps === steps) {
            continue;
        }

        const toCheck: Coord[] = [
            [x, y - 1],
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
        ];

        toCheck.forEach((c) => queue.push({ pos: c, steps: cur.steps + 1 }));
    }

    return total;
}

export function solve21p2(input: string[]): number {
    let start: Coord | undefined = undefined;
    for (const [y, l] of input.entries()) {
        const x = l.indexOf("S");
        if (x !== -1) {
            start = [x, y];
            break;
        }
    }

    assert(start);

    // totally original work
    const steps = 26501365;
    const mod = steps % input.length;
    const a = solve(input, start, mod);
    const b = solve(input, start, mod + input.length);
    const c = solve(input, start, mod + 2 * input.length);
    console.log(a, b, c);
    const d1 = b - a;
    const d2 = c - b;
    const d3 = d2 - d1;

    const A = Math.floor(d3 / 2);
    const B = d1 - 3 * A;
    const C = a - A - B;

    const f = (n: number) => A * n ** 2 + B * n + C;

    return f(Math.ceil(steps / input.length));
}
