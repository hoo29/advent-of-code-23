function expand(input: string[]) {
    const columns: string[] = JSON.parse(JSON.stringify(input)) as string[];

    for (let i = 0; i < input[0].length; ++i) {
        let empty = true;
        for (const line of input) {
            if (line[i] !== ".") {
                empty = false;
                break;
            }
        }

        if (empty) {
            for (let j = 0; j < columns.length; ++j) {
                const line = columns[j].split("");
                line.splice(i + (line.length - input[j].length), 0, ".");
                columns[j] = line.join("");
            }
        }
    }

    const rows: string[] = [];

    for (const line of columns) {
        rows.push(line);
        if (!line.includes("#")) {
            rows.push(line);
        }
    }

    return rows;
}

export function solve11p1(input: string[]): number {
    const expanded = expand(input);

    const cords: [number, number][] = [];
    for (let y = 0; y < expanded.length; ++y) {
        for (let x = 0; x < expanded[y].length; ++x) {
            if (expanded[y][x] === "#") {
                cords.push([y, x]);
            }
        }
    }

    let ans = 0;
    for (let c = 0; c < cords.length - 1; ++c) {
        const cur = cords[c];
        for (const subc of cords.slice(c + 1)) {
            ans += Math.abs(cur[0] - subc[0]) + Math.abs(cur[1] - subc[1]);
        }
    }

    return ans;
}

function emptyRow(input: string[], row: number) {
    return !input[row].includes("#");
}

function emptyColumn(input: string[], column: number) {
    for (const line of input) {
        if (line[column] === "#") {
            return false;
        }
    }
    return true;
}

export function solve11p2(input: string[]): number {
    const cords: [number, number][] = [];
    for (let y = 0; y < input.length; ++y) {
        for (let x = 0; x < input[y].length; ++x) {
            if (input[y][x] === "#") {
                cords.push([y, x]);
            }
        }
    }

    let ans = 0;
    const scaling = 1000000;
    for (let c = 0; c < cords.length - 1; ++c) {
        const cur = cords[c];
        for (const subc of cords.slice(c + 1)) {
            for (let nest = Math.min(cur[0], subc[0]); nest < Math.max(cur[0], subc[0]); ++nest) {
                if (emptyRow(input, nest)) {
                    ans += scaling;
                } else {
                    ans += 1;
                }
            }

            for (let nest = Math.min(cur[1], subc[1]); nest < Math.max(cur[1], subc[1]); ++nest) {
                if (emptyColumn(input, nest)) {
                    ans += scaling;
                } else {
                    ans += 1;
                }
            }
        }
    }

    return ans;
}
