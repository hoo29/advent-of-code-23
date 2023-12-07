export function solve02p1(input: string[]): number {
    const possible = {
        red: 12,
        green: 13,
        blue: 14,
    };

    let ans = 0;

    for (const line of input) {
        const parts = line.split(":");
        const id = Number(parts[0].split(" ")[1]);
        const results = parts[1].split(";");
        const tally = {
            red: 0,
            green: 0,
            blue: 0,
        };

        for (const result of results) {
            for (const cubeInfo of result.split(",")) {
                const cubeInfoParts = cubeInfo.trim().split(" ");
                const colour = cubeInfoParts[1] as keyof typeof tally;
                const quantity = Number(cubeInfoParts[0]);
                if (tally[colour] < quantity) {
                    tally[colour] = quantity;
                }
            }
        }

        let couldWork = true;
        for (const [colour, maxQuantity] of Object.entries(tally) as [keyof typeof tally, number][]) {
            if (possible[colour] < maxQuantity) {
                couldWork = false;
                break;
            }
        }
        if (couldWork) {
            ans += id;
        }
    }

    return ans;
}

export function solve02p2(input: string[]): number {
    let ans = 0;

    for (const line of input) {
        const parts = line.split(":");
        const results = parts[1].split(";");
        const tally = {
            red: 0,
            green: 0,
            blue: 0,
        };

        for (const result of results) {
            for (const cubeInfo of result.split(",")) {
                const cubeInfoParts = cubeInfo.trim().split(" ");
                const colour = cubeInfoParts[1] as keyof typeof tally;
                const quantity = Number(cubeInfoParts[0]);
                if (tally[colour] < quantity) {
                    tally[colour] = quantity;
                }
            }
        }

        ans += Object.values(tally).reduce((acc, val) => acc * val, 1);
    }

    return ans;
}
