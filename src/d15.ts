function hash(x: string) {
    let val = 0;
    for (const c of x) {
        val += c.charCodeAt(0);
        val *= 17;
        val %= 256;
    }

    return val;
}

export function solve15p1(input: string[]): number {
    const strs = input[0].split(",");
    let ans = 0;
    for (const str of strs) {
        ans += hash(str);
    }
    return ans;
}

function insertLens(box: [string, number][], lens: [string, number]) {
    for (const idk of box) {
        if (idk[0] === lens[0]) {
            idk[1] = lens[1];
            return box;
        }
    }
    box.push(lens);
    return box;
}

function removeLens(box: [string, number][], label: string) {
    for (let i = 0; i < box.length; ++i) {
        if (box[i][0] === label) {
            return [...box.slice(0, i), ...box.slice(i + 1)];
        }
    }
    return box;
}

export function solve15p2(input: string[]): number {
    const strs = input[0].split(",");
    const boxes: [string, number][][] = Array.from({ length: 256 }, () => []);
    for (const str of strs) {
        if (str.at(-1) === "-") {
            const label = str.slice(0, -1);
            const boxInd = hash(label);
            const newBox = removeLens(boxes[boxInd], label);
            boxes[boxInd] = newBox;
        } else {
            const label = str.split("=")[0];
            const boxInd = hash(label);
            const focalLength = Number(str.split("=")[1]);
            const newBox = insertLens(boxes[boxInd], [label, focalLength]);
            boxes[boxInd] = newBox;
        }
    }

    let ans = 0;
    for (let bind = 0; bind < boxes.length; ++bind) {
        for (let lind = 0; lind < boxes[bind].length; ++lind) {
            ans += (bind + 1) * (lind + 1) * boxes[bind][lind][1];
        }
    }
    return ans;
}
