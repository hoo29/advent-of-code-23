import fs from "fs";
type Pipe = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

type Direction = "N" | "E" | "S" | "W" | "-";

type Cord = {
    x: number;
    y: number;
};

type Flood = Cord & {
    direction: Direction;
};

type Node = Cord & {
    direction: Direction;
    pipe: Pipe;
};

type Path = {
    cordHistory: Set<string>;
    history: Node[];
    node: Node;
};

type Input = Pipe[][];

function findStart(input: Input): Node {
    for (let y = 0; y < input.length; ++y) {
        if (input[y].includes("S")) {
            const x = input[y].indexOf("S");
            return {
                y,
                x: input[y].indexOf("S"),
                pipe: input[y][x],
                direction: "-",
            };
        }
    }

    throw new Error("No start found");
}

function getNeighbour(input: Input, current: Node): Node | undefined {
    let cord: Cord;
    const x = current.x;
    const y = current.y;
    switch (current.direction) {
        case "N":
            cord = { x, y: y - 1 };
            break;
        case "E":
            cord = { x: x + 1, y };
            break;
        case "S":
            cord = { x, y: y + 1 };
            break;
        case "W":
            cord = { x: x - 1, y };
            break;
        default:
            throw new Error("terrible times");
    }

    if (
        // in bounds
        cord.y >= 0 &&
        cord.y < input.length &&
        cord.x >= 0 &&
        cord.x < input[cord.y].length
    ) {
        const neighbour: Node = {
            direction: "-",
            ...cord,
            pipe: input[cord.y][cord.x],
        };

        const connection = canConnect(current, neighbour);

        if (connection.connect) {
            neighbour.direction = connection.newDirection;
            return neighbour;
        }
    }

    return undefined;
}

function canConnect(cur: Node, next: Node): { connect: boolean; newDirection: Direction } {
    if (next.pipe === "S") {
        return { connect: true, newDirection: "-" };
    }

    if (next.pipe === ".") {
        return { connect: false, newDirection: "-" };
    }
    type Mapping = { [x in Pipe]?: Direction };

    const northPipes: Mapping = {
        "|": "N",
        "7": "W",
        F: "E",
    };

    const eastPipes: Mapping = {
        "-": "E",
        J: "N",
        "7": "S",
    };

    const southPipes: Mapping = {
        "|": "S",
        L: "E",
        J: "W",
    };

    const westPipes: Mapping = {
        "-": "W",
        L: "N",
        F: "S",
    };

    let pipes: Mapping;

    switch (cur.direction) {
        case "N":
            pipes = northPipes;
            break;
        case "E":
            pipes = eastPipes;
            break;
        case "S":
            pipes = southPipes;
            break;
        case "W":
            pipes = westPipes;
            break;
        default:
            throw new Error("terrible times");
    }

    return {
        connect: typeof pipes[next.pipe] !== "undefined",
        newDirection: pipes[next.pipe] ?? "-",
    };
}

function cordToStr(c: Cord) {
    return `${c.x},${c.y}`;
}

function solve(input: Input, allPaths: Path[]) {
    while (allPaths.length > 0) {
        const cur = allPaths.shift();
        if (typeof cur === "undefined") {
            throw new Error("idk");
        }
        cur.history.push(cur.node);
        cur.cordHistory.add(cordToStr(cur.node));

        const neighbour = getNeighbour(input, cur.node);

        if (typeof neighbour !== "undefined") {
            const newPath: Path = {
                history: cur.history,
                node: neighbour,
                cordHistory: cur.cordHistory,
            };

            if (neighbour.pipe === "S") {
                return newPath;
            }

            const cordStr = cordToStr(neighbour);
            if (!newPath.cordHistory.has(cordStr)) {
                allPaths.push(newPath);
            }
        }
    }

    throw new Error("This didn't work");
}

export function solve10p1(input: unknown): number {
    const pInput = input as Input;

    const start = findStart(pInput);
    const allPaths: Path[] = [];
    ["N", "E", "S", "W"].forEach((d) =>
        allPaths.push({
            history: [],
            node: {
                x: start.x,
                y: start.y,
                direction: d as Direction,
                pipe: "S",
            },
            cordHistory: new Set(),
        })
    );

    const correct = solve(pInput, allPaths);

    return [...correct.cordHistory].length / 2;
}

function getPipeForStart(path: Path): Pipe {
    const dirs = `${path.history[0].direction}${path.history.at(-1)?.direction}`;

    switch (dirs) {
        case "SS":
        case "NN":
            return "|";
        case "EW":
        case "WE":
            return "-";
        case "NW":
        case "ES":
            return "L";
        case "NE":
        case "WS":
            return "J";
        case "SE":
        case "WN":
            return "7";
        case "EN":
        case "SW":
            return "F";
        default:
            throw new Error(`why ${dirs}`);
    }
}

export function solve10p2(input: unknown): number {
    const pInput = input as Input;

    const start = findStart(pInput);
    const allPaths: Path[] = [];
    ["N", "E", "S", "W"].forEach((d) =>
        allPaths.push({
            history: [],
            node: {
                x: start.x,
                y: start.y,
                direction: d as Direction,
                pipe: "S",
            },
            cordHistory: new Set(),
        })
    );

    const correct = solve(pInput, allPaths);
    const startPipe = getPipeForStart(correct);
    // GLORIOUS
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    pInput[start.y] = (pInput[start.y] as any).replace("S", startPipe);
    console.log(startPipe);

    const vertPipes = ["|", "L", "J"];
    let count = 0;
    for (let y = 0; y < pInput.length; ++y) {
        for (let x = 0; x < pInput[y].length; ++x) {
            if (!correct.cordHistory.has(cordToStr({ x, y }))) {
                let vertCount = 0;
                for (let subX = x + 1; subX < pInput[y].length; ++subX) {
                    const subCur = pInput[y][subX];
                    if (correct.cordHistory.has(cordToStr({ x: subX, y })) && vertPipes.includes(subCur)) {
                        ++vertCount;
                    }
                }
                const newLine = (pInput[y] as unknown as string).split("");
                if (vertCount % 2 === 1) {
                    ++count;
                    newLine[x] = "I";
                }
                pInput[y] = newLine.join("") as unknown as Pipe[];
            }
        }
    }

    fs.writeFileSync("why", "");
    for (const line of pInput) {
        fs.appendFileSync("why", line as unknown as string);
        fs.appendFileSync("why", "\n");
    }

    return count;
}
