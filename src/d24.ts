import { Arith, RatNum, init } from "z3-solver";

const info = ["x", "y", "z", "dx", "dy", "dz"] as const;

type Hail = { [x in (typeof info)[number]]: number };

// Thanks random forum post
function intersect(h0: Hail, h1: Hail) {
    const a1 = h0.dy / h0.dx;
    const b1 = h0.y - a1 * h0.x;
    const a2 = h1.dy / h1.dx;
    const b2 = h1.y - a2 * h1.x;
    const cx = (b2 - b1) / (a1 - a2);
    const cy = cx * a1 + b1;
    const future = cx > h0.x === h0.dx > 0 && cx > h1.x === h1.dx > 0;
    return { future, cx, cy };
}

export function solve24p1(input: string[]): number {
    const allHail: Hail[] = [];
    for (const l of input) {
        const a = l
            .split(" @ ")[0]
            .split(", ")
            .map((l) => Number(l));

        const b = l
            .split(" @ ")[1]
            .split(", ")
            .map((l) => Number(l));
        allHail.push({
            x: a[0],
            y: a[1],
            z: a[2],
            dx: b[0],
            dy: b[1],
            dz: b[2],
        });
    }

    const min = 200000000000000;
    const max = 400000000000000;

    let count = 0;
    for (let a = 0; a < allHail.length; ++a) {
        for (let b = 0; b < allHail.length; ++b) {
            if (b === a) {
                continue;
            }
            const res = intersect(allHail[a], allHail[b]);
            if (res.future && res.cx >= min && res.cx <= max && res.cy >= min && res.cy <= max) {
                ++count;
            }
        }
    }

    return count / 2;
}

export async function solve24p2(input: string[]): Promise<number> {
    const allHail: Hail[] = [];
    for (const l of input) {
        const a = l
            .split(" @ ")[0]
            .split(", ")
            .map((l) => Number(l));

        const b = l
            .split(" @ ")[1]
            .split(", ")
            .map((l) => Number(l));
        allHail.push({
            x: a[0],
            y: a[1],
            z: a[2],
            dx: b[0],
            dy: b[1],
            dz: b[2],
        });
    }

    const { Context } = await init();
    const { Solver, Real } = Context("main");
    const solver = new Solver();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inputs: { [x in keyof Hail]: Arith<"main"> } = {} as any;
    info.forEach((i) => (inputs[i] = Real.const(i)));

    for (let i = 0; i < 5; ++i) {
        const ind = Real.const(String(i));
        const { x, y, z, dx, dy, dz } = allHail[i];

        solver.add(ind.mul(dx).add(x).eq(ind.mul(inputs.dx).add(inputs.x)));
        solver.add(ind.mul(dy).add(y).eq(ind.mul(inputs.dy).add(inputs.y)));
        solver.add(ind.mul(dz).add(z).eq(ind.mul(inputs.dz).add(inputs.z)));
    }

    await solver.check();

    const model = solver.model();
    const ans = (model.eval(inputs.x.add(inputs.y).add(inputs.z)) as RatNum).value();

    // seems fine
    return Number(String(ans.numerator / ans.denominator));
}
