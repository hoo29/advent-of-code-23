export function solve06p1(input: string[]): number {
    const allTimes = input[0]
        .split(":")[1]
        .trim()
        .split(" ")
        .filter((x) => x)
        .map((x) => Number(x));

    const allDistances = input[1]
        .split(":")[1]
        .trim()
        .split(" ")
        .filter((x) => x)
        .map((x) => Number(x));

    if (allTimes.length !== allDistances.length) {
        throw new Error("Something has gone really wrong");
    }

    let ans = 1;
    for (let i = 0; i <= allTimes.length; ++i) {
        const time = allTimes[i];
        const distance = allDistances[i];
        let count = 0;
        for (let t = 1; t <= time - 1; ++t) {
            if ((time - t) * t > distance) {
                ++count;
            }
        }
        if (count > 0) {
            ans *= count;
        }
    }

    return ans;
}

export function solve06p2(input: string[]): number {
    const time = Number(
        input[0]
            .split(":")[1]
            .trim()
            .split(" ")
            .filter((x) => x)
            .join("")
    );

    const distance = Number(
        input[1]
            .split(":")[1]
            .trim()
            .split(" ")
            .filter((x) => x)
            .join("")
    );

    let count = 0;
    for (let t = 1; t <= time - 1; ++t) {
        if ((time - t) * t > distance) {
            ++count;
        }
    }

    return count;
}
