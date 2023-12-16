function splitPatternH(input: string[], y: number): [string[], string[]] {
    const toCopy = Math.min(y, input.length - y);

    return [input.slice(toCopy === y ? 0 : y - toCopy, y), input.slice(y, y + toCopy)];
}

function transpose(input: string[]): string[] {
    const t = input[0].split("").map((a) => a);
    for (let x = 1; x < input.length; ++x) {
        input[x].split("").forEach((x, ind) => (t[ind] += x));
    }
    return t;
}

function checkEqualH(a: string[], b: string[]) {
    if (a.length !== b.length) {
        throw new Error("lengths wrong");
    }

    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[b.length - i - 1]) {
            return false;
        }
    }

    return true;
}

export function solve13p1(input: string[]): number {
    const patterns = input.reduce<string[][]>(
        (acc, cur) => {
            if (!cur) {
                acc.push([]);
            } else {
                acc.at(-1)?.push(cur);
            }
            return acc;
        },
        [[]]
    );

    let v = 0;
    for (const pattern of patterns) {
        const better = transpose(pattern);
        for (let j = 1; j < better.length; ++j) {
            const splitH = splitPatternH(better, j);
            if (checkEqualH(splitH[0], splitH[1])) {
                v += j;
                break;
            }
        }
    }

    let h = 0;
    for (const pattern of patterns) {
        for (let j = 1; j < pattern.length; ++j) {
            const splitH = splitPatternH(pattern, j);
            if (checkEqualH(splitH[0], splitH[1])) {
                h += j;
                break;
            }
        }
    }
    return v + 100 * h;
}

function offByOne(a: string, b: string) {
    let changed = false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            if (!changed) {
                changed = true;
            } else {
                return false;
            }
        }
    }

    return true;
}

function checkEqualH2(a: string[], b: string[]) {
    if (a.length !== b.length) {
        throw new Error("lengths wrong");
    }

    let oneChanged = false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[b.length - i - 1]) {
            if (offByOne(a[i], b[b.length - i - 1])) {
                if (!oneChanged) {
                    oneChanged = true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    return true;
}

export function solve13p2(input: string[]): number {
    const patterns = input.reduce<string[][]>(
        (acc, cur) => {
            if (!cur) {
                acc.push([]);
            } else {
                acc.at(-1)?.push(cur);
            }
            return acc;
        },
        [[]]
    );

    let v = 0;
    let h = 0;
    for (const pattern of patterns) {
        const better = transpose(pattern);
        let found = false;
        for (let j = 1; j < better.length; ++j) {
            const splitH = splitPatternH(better, j);
            if (checkEqualH(splitH[0], splitH[1])) {
                continue;
            }
            if (checkEqualH2(splitH[0], splitH[1])) {
                v += j;
                found = true;
                break;
            }
        }

        for (let j = 1; j < pattern.length && !found; ++j) {
            const splitH = splitPatternH(pattern, j);
            if (checkEqualH(splitH[0], splitH[1])) {
                continue;
            }
            if (checkEqualH2(splitH[0], splitH[1])) {
                h += j;
                found = true;
                break;
            }
        }

        if (!found) {
            throw new Error("oh no");
        }
    }

    // too high 38415
    // too low 21915

    return v + 100 * h;
}
