import v8 from "node:v8";

type Coord = {
    x: number;
    y: number;
    z: number;
};

type Brick = {
    start: Coord;
    end: Coord;
    id: number;
};

function checkIfOverlap(a: Brick, b: Brick) {
    const xOverlap = a.end.x >= b.start.x && a.start.x <= b.end.x;
    const yOverlap = a.end.y >= b.start.y && a.start.y <= b.end.y;
    return xOverlap && yOverlap;
}

function brickEquals(a: Brick, b: Brick) {
    return a.start.x === b.start.x && a.start.y === b.start.y && a.start.z === b.start.z;
}

function falling(bricks: Brick[]) {
    const moved = new Set<number>();
    let done = true;
    do {
        done = true;

        for (const b of bricks) {
            if (Math.min(b.start.z, b.end.z) === 1) {
                continue;
            }

            // find all bricks below
            const bricksToCheck = bricks.filter(
                (bb) => Math.max(bb.start.z, bb.end.z) === Math.min(b.start.z, b.end.z) - 1
            );

            let overlap = false;
            for (const other of bricksToCheck) {
                if (checkIfOverlap(other, b)) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                moved.add(b.id);
                --b.start.z;
                --b.end.z;
                done = false;
            }
        }
    } while (!done);

    return moved.size;
}

export function solve22p1(input: string[]): number {
    const bricks: Brick[] = [];
    let ind = 0;
    for (const l of input) {
        const parts = l.split("~");
        const start = parts[0].split(",").map((x) => Number(x));
        const end = parts[1].split(",").map((x) => Number(x));
        bricks.push({
            id: ind++,
            start: {
                x: start[0],
                y: start[1],
                z: start[2],
            },
            end: {
                x: end[0],
                y: end[1],
                z: end[2],
            },
        });
    }

    falling(bricks);

    let count = 0;
    for (const b of bricks) {
        // check if touching any brick above
        const supportedBricks = bricks
            .filter((bb) => Math.min(bb.start.z, bb.end.z) === Math.max(b.start.z, b.end.z) + 1)
            .filter((a) => checkIfOverlap(a, b));

        if (supportedBricks.length === 0) {
            ++count;
            continue;
        }

        // check if any other brick on same z is touching
        const otherBricks = bricks
            .filter((bb) => Math.max(bb.start.z, bb.end.z) === Math.max(b.start.z, b.end.z))
            .filter((a) => !brickEquals(a, b));

        const otherSupports = supportedBricks.every((x) => otherBricks.some((y) => checkIfOverlap(y, x)));

        if (otherSupports) {
            ++count;
            continue;
        }
    }

    return count;
}

export function solve22p2(input: string[]): number {
    const bricks: Brick[] = [];
    let ind = 0;
    for (const l of input) {
        const parts = l.split("~");
        const start = parts[0].split(",").map((x) => Number(x));
        const end = parts[1].split(",").map((x) => Number(x));
        bricks.push({
            id: ind++,
            start: {
                x: start[0],
                y: start[1],
                z: start[2],
            },
            end: {
                x: end[0],
                y: end[1],
                z: end[2],
            },
        });
    }

    falling(bricks);
    const base = v8.deserialize(v8.serialize(bricks)) as Brick[];
    let count = 0;
    let pt1 = 0;
    for (const b of base) {
        console.log(b.id, "of", base.length);
        const bam = v8.deserialize(v8.serialize(base.filter((a) => !brickEquals(a, b)))) as Brick[];
        const ccount = falling(bam);
        if (ccount === 0) {
            ++pt1;
        }
        count += ccount;
    }
    console.log(pt1);
    return count;
}
