function minusOneFromInfo(info: number[]): number[] {
    const newInfo = [...info];
    for (let i = 0; i < newInfo.length; ++i) {
        if (newInfo[i] !== 0) {
            --newInfo[i];
            return newInfo;
        }
    }

    return newInfo;
}

function arrToStr(info: number[]) {
    let line = "";
    info.forEach((x) => (line += x));
    return line;
}

function solve(springs: string, info: number[], broken: boolean, cache: Map<string, number>): number {
    const cacheKey = `${springs}${arrToStr(info)}${broken}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
    }
    // check if any info left and still a broken spring
    if (info.length === 0) {
        return springs.includes("#") ? 0 : 1;
    }

    // check if any broken springs left to account for
    if (springs.length === 0) {
        return info.reduce((acc, a) => (acc += a), 0) === 0 ? 1 : 0;
    }

    // if we have checked all current broken spring options
    if (info[0] === 0) {
        if ([".", "?"].includes(springs[0])) {
            const ans = solve(springs.slice(1), info.slice(1), false, cache);
            cache.set(cacheKey, ans);
            return ans;
        } else {
            cache.set(cacheKey, 0);
            return 0;
        }
    }

    // if we have just come from a broken spring
    if (broken) {
        // if info[0] !== 0 and we are not at a broken string, fail
        if (["#", "?"].includes(springs[0])) {
            const ans = solve(springs.slice(1), minusOneFromInfo(info), true, cache);
            cache.set(cacheKey, ans);
            return ans;
        } else {
            cache.set(cacheKey, 0);
            return 0;
        }
    }

    if (springs.at(0) === "#") {
        const ans = solve(springs.slice(1), minusOneFromInfo(info), true, cache);
        cache.set(cacheKey, ans);
        return ans;
    }

    if (springs.at(0) === ".") {
        const ans = solve(springs.slice(1), info, false, cache);
        cache.set(cacheKey, ans);
        return ans;
    }

    if (springs.at(0) === "?") {
        const ans =
            solve(springs.slice(1), info, false, cache) + solve(springs.slice(1), minusOneFromInfo(info), true, cache);
        cache.set(cacheKey, ans);
        return ans;
    }

    throw new Error("oh, oh no");
}

export function solve12p1(input: string[]): number {
    let ans = 0;
    const cache: Map<string, number> = new Map();
    for (const line of input) {
        const springs = line.split(" ")[0];
        const info = line
            .split(" ")[1]
            .split(",")
            .map((x) => Number(x));
        ans += solve(springs, info, false, cache);
    }
    return ans;
}

function expand(input: string[]) {
    const bigger: string[] = [];
    for (const line of input) {
        let newLine = "";

        const springs = line.split(" ")[0];
        newLine += `${springs}?${springs}?${springs}?${springs}?${springs} `;

        const info = line.split(" ")[1];

        newLine += `${info},${info},${info},${info},${info}`;

        bigger.push(newLine);
    }

    return bigger;
}

export function solve12p2(input: string[]): number {
    let ans = 0;
    const bigger = expand(input);
    for (const line of bigger) {
        const cache: Map<string, number> = new Map();
        const springs = line.split(" ")[0];
        const info = line
            .split(" ")[1]
            .split(",")
            .map((x) => Number(x));
        ans += solve(springs, info, false, cache);
    }
    return ans;
}
