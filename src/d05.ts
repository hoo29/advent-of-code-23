function getMap(key: string, input: string[]): [number, number, number][] {
    const start = input.indexOf(key);
    if (start === -1) {
        throw new Error(`could not find ${key}`);
    }

    const items: [number, number, number][] = [];

    let end = start + 1;
    while (end < input.length) {
        const line = input[end];
        if (input[end] === "") {
            break;
        }
        items.push(
            line
                .split(" ")
                .map((val) => val)
                .map((val) => Number(val)) as [number, number, number]
        );
        ++end;
    }

    return items;
}

function doMap(item: number, map: [number, number, number][]): number {
    for (const m of map) {
        if (item >= m[1] && m[1] + m[2] >= item) {
            return m[0] + (item - m[1]);
        }
    }

    return item;
}

export function solve05p1(input: string[]): number {
    const seed = input[0]
        .split(":")[1]
        .trim()
        .split(" ")
        .map((s) => s)
        .map((s) => Number(s));
    console.log(seed);

    const seedToSoil = getMap("seed-to-soil map:", input);
    const soilToFertilizer = getMap("soil-to-fertilizer map:", input);
    const fertilizerToWater = getMap("fertilizer-to-water map:", input);
    const waterToLight = getMap("water-to-light map:", input);
    const lightToTemp = getMap("light-to-temperature map:", input);
    const tempToHumidity = getMap("temperature-to-humidity map:", input);
    const humidityToLocation = getMap("humidity-to-location map:", input);

    const location = [];

    for (const s of seed) {
        const soilNum = doMap(s, seedToSoil);
        const fertilizerNum = doMap(soilNum, soilToFertilizer);
        const waterNum = doMap(fertilizerNum, fertilizerToWater);
        const lightNum = doMap(waterNum, waterToLight);
        const temperatureNum = doMap(lightNum, lightToTemp);
        const humidityNum = doMap(temperatureNum, tempToHumidity);
        const locationNum = doMap(humidityNum, humidityToLocation);
        location.push(locationNum);
    }

    return Math.min(...location);
}

function doMapRange(ranges: [number, number][], map: [number, number, number][]): [number, number][] {
    const newRanges: [number, number][] = [];

    const rangesToProc = JSON.parse(JSON.stringify(ranges)) as [number, number][];

    while (rangesToProc.length > 0) {
        const range = rangesToProc.pop();
        if (typeof range === "undefined") {
            throw new Error("why");
        }
        let someMatch = false;
        for (const m of map) {
            const mapRange = [m[1], m[1] + m[2]];
            // Some overlap
            if (
                (range[0] >= mapRange[0] && range[0] <= mapRange[1]) ||
                (range[1] >= mapRange[0] && range[1] <= mapRange[1])
            ) {
                someMatch = true;
                // left
                if (range[0] < mapRange[0]) {
                    rangesToProc.push([range[0], mapRange[0] - 1]);
                }
                // right
                if (range[1] > mapRange[1]) {
                    rangesToProc.push([mapRange[1] + 1, range[1]]);
                }

                //      -------
                // -------
                //          ------
                // intersection
                const start = Math.max(mapRange[0], range[0]);
                const end = Math.min(mapRange[1], range[1]);

                const startOffset = m[0] + (start - mapRange[0]);
                newRanges.push([startOffset, startOffset + (end - start)]);
            }
        }
        // no match
        if (!someMatch) {
            newRanges.push(range);
        }
    }

    return newRanges;
}

export function solve05p2(input: string[]): number {
    const seed = input[0]
        .split(":")[1]
        .trim()
        .split(" ")
        .map((s) => s)
        .map((s) => Number(s));
    const seedRanges: [number, number][] = [];
    for (let i = 0; i < seed.length; i += 2) {
        seedRanges.push([seed[i], seed[i] + seed[i + 1]]);
    }

    const seedToSoil = getMap("seed-to-soil map:", input);
    const soilToFertilizer = getMap("soil-to-fertilizer map:", input);
    const fertilizerToWater = getMap("fertilizer-to-water map:", input);
    const waterToLight = getMap("water-to-light map:", input);
    const lightToTemp = getMap("light-to-temperature map:", input);
    const tempToHumidity = getMap("temperature-to-humidity map:", input);
    const humidityToLocation = getMap("humidity-to-location map:", input);

    const soilRanges = doMapRange(seedRanges, seedToSoil);
    const fertilizerRanges = doMapRange(soilRanges, soilToFertilizer);
    const waterRanges = doMapRange(fertilizerRanges, fertilizerToWater);
    const lightRanges = doMapRange(waterRanges, waterToLight);
    const tempRanges = doMapRange(lightRanges, lightToTemp);
    const humidityRanges = doMapRange(tempRanges, tempToHumidity);
    const locationRanges = doMapRange(humidityRanges, humidityToLocation);

    let min = Number.MAX_SAFE_INTEGER;
    for (const r of locationRanges) {
        if (r[0] < min) {
            min = r[0];
        }
    }

    return min;
}
