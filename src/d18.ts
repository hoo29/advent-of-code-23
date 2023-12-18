function coordToString(x: number, y: number): string {
    return `${x},${y}`;
}

export function flood(grid: string[][], x: number, y: number): [boolean, Set<string>] {
    const queue: [number, number][] = [];
    const visited: Set<string> = new Set();
    queue.push([x, y]);

    let outside = false;
    while (queue.length > 0) {
        const c = queue.shift();
        if (typeof c === "undefined") {
            throw new Error("why");
        }
        const x = c[0];
        const y = c[1];

        if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) {
            outside = true;
            continue;
        }

        if (grid[y][x] === "#") {
            continue;
        }

        if (visited.has(coordToString(x, y))) {
            continue;
        }

        visited.add(coordToString(x, y));

        const pairs: [number, number][] = [
            [x, y - 1],
            [x + 1, y],
            [x, y + 1],
            [x - 1, y],
        ];

        for (const p of pairs) {
            queue.push(p);
        }
    }

    return [outside, visited];
}

export function solve18p1Slow(input: string[]): number {
    let x = 0;
    let y = 0;

    const lagoon = new Set<string>();

    const allX: number[] = [];
    const allY: number[] = [];

    for (const line of input) {
        const dir = line.split(" ")[0];
        const count = Number(line.split(" ")[1]);

        if (dir === "R") {
            let i = x;
            for (; i < x + count; ++i) {
                allX.push(i);
                lagoon.add(coordToString(i, y));
            }
            x = i;
        } else if (dir === "L") {
            let i = x;
            for (; i > x - count; --i) {
                allX.push(i);
                lagoon.add(coordToString(i, y));
            }
            x = i;
        } else if (dir === "D") {
            let i = y;
            for (; i < y + count; ++i) {
                allY.push(i);
                lagoon.add(coordToString(x, i));
            }
            y = i;
        } else if (dir === "U") {
            let i = y;
            for (; i > y - count; --i) {
                allY.push(i);
                lagoon.add(coordToString(x, i));
            }
            y = i;
        }
    }

    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);
    const xOffset = 0 - minX;
    const yOffset = 0 - minY;
    const grid = Array.from({ length: maxY - minY + 1 }, () => Array<string>(maxX - minX + 1).fill("."));

    for (const c of lagoon) {
        const cy = Number(c.split(",")[1]) + yOffset;
        const cx = Number(c.split(",")[0]) + xOffset;
        grid[cy][cx] = "#";
    }

    let insideSum = 0;

    let outside = new Set<string>();
    for (let cy = 0; cy < grid.length; ++cy) {
        const line = grid[cy];
        for (let cx = 0; cx < line.length; ++cx) {
            const char = line[cx];
            if (char === "#") {
                continue;
            }

            if (outside.has(coordToString(cx, cy))) {
                continue;
            }

            const res = flood(grid, cx, cy);
            if (!res[0]) {
                insideSum += res[1].size;
                for (const c of res[1]) {
                    const ccy = Number(c.split(",")[1]);
                    const ccx = Number(c.split(",")[0]);
                    grid[ccy][ccx] = "#";
                }
            } else {
                outside = new Set([...outside, ...res[1]]);
            }
        }
    }

    console.log(insideSum);

    return grid.reduce((acc, cur) => (acc += cur.filter((a) => a === "#").length), 0);
}

// RIP bad flood fill
function shoelaceWithPick(coords: { x: number; y: number; count: number }[]): number {
    let area = 0;
    const border = coords.reduce((acc, cur) => (acc += cur.count), 0);

    for (let i = 0; i < coords.length; i++) {
        const j = (i + 1) % coords.length;
        area += coords[i].x * coords[j].y;
        area -= coords[j].x * coords[i].y;
    }

    const interior = Math.abs(area / 2) - border / 2 + 1;

    return interior + border;
}

export function solve18p1(input: string[]): number {
    let x = 0;
    let y = 0;

    const vertices: { x: number; y: number; count: number }[] = [];
    vertices.push({ x, y, count: 0 });

    for (const line of input) {
        const dir = line.split(" ")[0];
        const count = Number(line.split(" ")[1]);

        if (dir === "R") {
            vertices.push({
                x: x + count,
                y,
                count,
            });
            x += count;
        } else if (dir === "L") {
            vertices.push({
                x: x - count,
                y,
                count,
            });
            x -= count;
        } else if (dir === "D") {
            vertices.push({
                x,
                y: y + count,
                count,
            });
            y += count;
        } else if (dir === "U") {
            vertices.push({
                x,
                y: y - count,
                count,
            });
            y -= count;
        }
    }

    return shoelaceWithPick(vertices);
}

export function solve18p2(input: string[]): number {
    let x = 0;
    let y = 0;

    const vertices: { x: number; y: number; count: number }[] = [];
    vertices.push({ x, y, count: 0 });

    for (const line of input) {
        const eDir = Number(line.split(" ")[2].slice(-2)[0]);
        const dir = eDir === 0 ? "R" : eDir === 1 ? "D" : eDir === 2 ? "L" : "U";
        const count = Number.parseInt(line.split(" ")[2].slice(2, -2), 16);

        if (dir === "R") {
            vertices.push({
                x: x + count,
                y,
                count,
            });
            x += count;
        } else if (dir === "L") {
            vertices.push({
                x: x - count,
                y,
                count,
            });
            x -= count;
        } else if (dir === "D") {
            vertices.push({
                x,
                y: y + count,
                count,
            });
            y += count;
        } else if (dir === "U") {
            vertices.push({
                x,
                y: y - count,
                count,
            });
            y -= count;
        }
    }

    return shoelaceWithPick(vertices);
}
