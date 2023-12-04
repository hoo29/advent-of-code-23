export function solve01p1(input: string[]): number {
    return input.reduce<number>((acc, cur) => {
        let line = 0;
        const arr = cur.split("");
        for (const c of arr) {
            const digit = Number(c);
            if (!Number.isNaN(digit)) {
                line += digit * 10;
                break;
            }
        }
        for (const c of arr.reverse()) {
            const digit = Number(c);
            if (!Number.isNaN(digit)) {
                line += digit;
                break;
            }
        }
        return acc + line;
    }, 0);
}

export function solve01p2(input: string[]): number {
    const numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const numbersReversed = numbers.map((val) => val.split("").reverse().join(""));

    return input.reduce<number>((acc, line) => {
        acc += parseLine(line, numbers) * 10;
        acc += parseLine(line.split("").reverse().join(""), numbersReversed);

        return acc;
    }, 0);
}

function parseLine(line: string, numbers: string[]): number {
    const lineArr = line.split("");
    for (let i = 0; i < lineArr.length; ++i) {
        const c = lineArr[i];
        const digit = Number(c);
        if (!Number.isNaN(digit)) {
            return digit;
        }

        for (const [ind, stringNum] of numbers.entries()) {
            if (i + stringNum.length > lineArr.length) {
                continue;
            }
            if (line.substring(i, i + stringNum.length) === stringNum) {
                return ind + 1;
            }
        }
    }

    throw new Error("oh, oh no");
}
