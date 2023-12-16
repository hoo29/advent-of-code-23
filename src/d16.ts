type Dir = "N" | "E" | "S" | "W";

type Coord = [number, number];

function hash(c: Coord, dir: Dir) {
    return `${c[0]},${c[1]},${dir}`;
}

function move(c: Coord, d: Dir): Coord {
    switch (d) {
        case "N":
            return [c[0], c[1] - 1];
        case "E":
            return [c[0] + 1, c[1]];
        case "S":
            return [c[0], c[1] + 1];
        case "W":
            return [c[0] - 1, c[1]];
        default:
            throw new Error("hmmm");
    }
}

function energise(input: string[], c: Coord, d: Dir, history: Set<string>): Set<string> {
    if (c[0] < 0 || c[0] >= input[0].length || c[1] < 0 || c[1] >= input.length) {
        return history;
    }

    const key = hash(c, d);
    if (history.has(key)) {
        return history;
    }

    history.add(hash(c, d));
    const cell = input[c[1]][c[0]];

    if (cell === ".") {
        return energise(input, move(c, d), d, history);
    }

    if (cell === "-" && (d === "E" || d === "W")) {
        return energise(input, move(c, d), d, history);
    }

    if (cell === "|" && (d === "N" || d === "S")) {
        return energise(input, move(c, d), d, history);
    }

    if (cell === "|" && (d === "E" || d === "W")) {
        energise(input, move(c, "N"), "N", history);
        energise(input, move(c, "S"), "S", history);
        return history;
    }

    if (cell === "-" && (d === "N" || d === "S")) {
        energise(input, move(c, "E"), "E", history);
        energise(input, move(c, "W"), "W", history);
        return history;
    }

    if (cell === "/") {
        switch (d) {
            case "N":
                return energise(input, move(c, "E"), "E", history);
            case "E":
                return energise(input, move(c, "N"), "N", history);
            case "S":
                return energise(input, move(c, "W"), "W", history);
            case "W":
                return energise(input, move(c, "S"), "S", history);
            default:
                throw new Error("hmmm");
        }
    }

    if (cell === "\\") {
        switch (d) {
            case "N":
                return energise(input, move(c, "W"), "W", history);
            case "E":
                return energise(input, move(c, "S"), "S", history);
            case "S":
                return energise(input, move(c, "E"), "E", history);
            case "W":
                return energise(input, move(c, "N"), "N", history);
            default:
                throw new Error("hmmm");
        }
    }

    throw new Error("oh no");
}

export function solve16p1(input: string[]): number {
    const e = energise(input, [0, 0], "E", new Set());
    const b: Array<Array<string | number>> = input.map((a) => a.split(""));
    const unique = new Set<string>();
    for (const c of e) {
        const x = Number(c.split(",")[0]);
        const y = Number(c.split(",")[1]);
        const d = c.split(",")[2];
        const s = d === "N" ? "^" : d === "E" ? ">" : d === "S" ? "v" : "<";
        const cell = b[y][x];
        if (["^", ">", "v", "<"].includes(String(cell))) {
            b[y][x] = 2;
        } else if (typeof cell === "number") {
            b[y][x] = cell + 1;
        } else if (!["|", "/", "\\", "-"].includes(String(cell))) {
            b[y][x] = s;
        }
        unique.add(`${x},${y}`);
    }
    console.log("\n");
    b.forEach((l) => console.log(l.join("")));
    console.log("\n");

    return unique.size;
}

type StartPos = [[number, number], Dir];

export function solve16p2(input: string[]): number {
    let max = Number.MIN_SAFE_INTEGER;
    const start: StartPos[] = [];
    input.forEach((_, ind) => {
        start.push([[0, ind], "E"]);
        start.push([[input[0].length - 1, ind], "W"]);
    });

    input[0].split("").forEach((_, ind) => {
        start.push([[ind, 0], "S"]);
        start.push([[ind, input.length - 1], "N"]);
    });

    for (const s of start) {
        const e = energise(input, s[0], s[1], new Set());
        const unique = new Set<string>();
        for (const c of e) {
            const x = Number(c.split(",")[0]);
            const y = Number(c.split(",")[1]);
            unique.add(`${x},${y}`);
        }
        if (unique.size > max) {
            max = unique.size;
        }
    }

    return max;
}
