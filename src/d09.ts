export function solve09p1(input: string[]): number {
    let ans = 0;

    for (const line of input) {
        const rows: number[][] = [];
        let done = false;
        let cur = line
            .split(" ")
            .filter((x) => x)
            .map((x) => Number(x));
        rows.push(cur);
        while (!done) {
            const next: number[] = [];
            for (let ind = 1; ind < cur.length; ++ind) {
                next.push(cur[ind] - cur[ind - 1]);
            }

            rows.push(next);
            done = next.every((x) => x === 0);
            cur = next;
        }

        for (let ind = rows.length - 2; ind >= 0; --ind) {
            rows[ind].push(rows[ind].slice(-1)[0] + rows[ind + 1].slice(-1)[0]);
        }
        ans += rows[0].slice(-1)[0];
    }
    return ans;
}

export function solve09p2(input: string[]): number {
    let ans = 0;

    for (const line of input) {
        const rows: number[][] = [];
        let done = false;
        let cur = line
            .split(" ")
            .filter((x) => x)
            .map((x) => Number(x));
        rows.push(cur);
        while (!done) {
            const next: number[] = [];
            for (let ind = 1; ind < cur.length; ++ind) {
                next.push(cur[ind] - cur[ind - 1]);
            }

            rows.push(next);
            done = next.every((x) => x === 0);
            cur = next;
        }

        for (let ind = rows.length - 2; ind >= 0; --ind) {
            rows[ind].unshift(rows[ind][0] - rows[ind + 1][0]);
        }
        ans += rows[0][0];
    }
    return ans;
}
