type Dir = "N" | "E" | "S" | "W";

function transpose(input: string[]): string[] {
    const t = input[0].split("").map((a) => a);
    for (let x = 1; x < input.length; ++x) {
        input[x].split("").forEach((x, ind) => (t[ind] += x));
    }
    return t;
}

function tiltN(input: string[]) {
    const tilted: string[] = [];
    const t = transpose(input);

    for (const line of t) {
        const newLine = line.split("");
        let changed = true;
        do {
            changed = false;
            for (let i = 1; i < newLine.length; ++i) {
                if (newLine[i - 1] === "." && newLine[i] === "O") {
                    newLine[i] = ".";
                    newLine[i - 1] = "O";
                    changed = true;
                }
            }
        } while (changed);

        tilted.push(newLine.join(""));
    }

    return transpose(tilted);
}

function tiltL(input: string[], n: boolean) {
    const tilted: string[] = [];
    const t = n ? transpose(input) : input;

    for (const line of t) {
        const newLine = line.split("");
        let changed = true;
        do {
            changed = false;
            for (let i = 1; i < newLine.length; ++i) {
                if (newLine[i - 1] === "." && newLine[i] === "O") {
                    newLine[i] = ".";
                    newLine[i - 1] = "O";
                    changed = true;
                }
            }
        } while (changed);

        tilted.push(newLine.join(""));
    }

    return n ? transpose(tilted) : tilted;
}

function tiltR(input: string[], s: boolean) {
    const tilted: string[] = [];
    const t = s ? transpose(input) : input;

    for (const line of t) {
        const newLine = line.split("");
        let changed = true;
        do {
            changed = false;
            for (let i = newLine.length - 1; i >= 0; --i) {
                if (newLine[i] === "." && newLine[i - 1] === "O") {
                    newLine[i - 1] = ".";
                    newLine[i] = "O";
                    changed = true;
                }
            }
        } while (changed);

        tilted.push(newLine.join(""));
    }

    return s ? transpose(tilted) : tilted;
}

function tilt(input: string[], dir: Dir) {
    switch (dir) {
        case "N":
            return tiltL(input, true);
        case "W":
            return tiltL(input, false);
        case "S":
            return tiltR(input, true);
        case "E":
            return tiltR(input, false);
        default:
            throw new Error("hmm");
    }
}

export function solve14p1(input: string[]): number {
    const tilted = tiltN(input);
    return tilted.reduce(
        (acc, cur, ind) => (acc += cur.split("").filter((a) => a === "O").length * (tilted.length - ind)),
        0
    );
}

export function solve14p2(input: string[]): number {
    let tilted = input;
    const cache: Map<string, number> = new Map();
    console.log("\n\n");
    let i = 0;
    const end = 1000000000;
    // const end = 17;
    let foundCycle = false;
    while (i < end) {
        tilted = tilt(tilted, "N");
        tilted = tilt(tilted, "W");
        tilted = tilt(tilted, "S");
        tilted = tilt(tilted, "E");

        const key = tilted.reduce((acc, cur) => (acc += cur), "");
        const cycleStart = cache.get(key);
        if (typeof cycleStart !== "undefined" && !foundCycle) {
            console.log("cycle found");
            console.log(cycleStart);
            const cycleLength = i - cycleStart;
            // i + (x * cl) === end
            // x = (end - i / cl)
            /**
             * 00 01 02 03 04 05 06 07 08
             *          09 10 11 12 13 14
             *          15 16 17 18 19 20
             */
            i += Math.floor((end - i) / cycleLength) * cycleLength;
            ++i;
            foundCycle = true;
        } else {
            cache.set(key, i + 1);
            ++i;
        }
    }

    return tilted.reduce(
        (acc, cur, ind) => (acc += cur.split("").filter((a) => a === "O").length * (tilted.length - ind)),
        0
    );
}
