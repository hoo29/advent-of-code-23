import fs from "fs";
import path from "path";
import { lcm } from "mathjs";

type ModuleType = "%" | "&" | "broadcaster" | "button";
type Pulse = "high" | "low";

class Module {
    constructor(
        public readonly name: string,
        public readonly tx: string[],
        public readonly type: ModuleType,
        public txType: Pulse,
        public rxState: Map<string, Pulse>,
        public lastRxState: Pulse
    ) {}

    public toString() {
        return `${this.name}-${this.type}`;
    }

    public process(): { txType: Pulse; tx: string[]; changed: boolean } {
        let changed = false;

        if (["button", "broadcaster"].includes(this.type)) {
            this.txType = "low";
            changed = true;
        }

        if (this.type === "%" && this.lastRxState === "low") {
            this.txType = this.txType === "high" ? "low" : "high";
            changed = true;
        }

        if (this.type === "&") {
            if (Array.from(this.rxState.values()).every((x) => x === "high")) {
                this.txType = "low";
            } else {
                this.txType = "high";
            }
            changed = true;
        }

        return { txType: this.txType, tx: this.tx, changed };
    }
}

export function solve20p1(input: string[]): number {
    const modules = new Map<string, Module>();

    modules.set("button", new Module("button", ["broadcaster"], "button", "low", new Map(), "low"));

    for (const l of input) {
        const parts = l.split(" -> ");
        const destinations = parts[1].split(", ");
        if (["%", "&"].includes(parts[0][0])) {
            const name = parts[0].slice(1);
            modules.set(name, new Module(name, destinations, parts[0][0] as ModuleType, "low", new Map(), "low"));
        } else if (parts[0] === "broadcaster") {
            modules.set(parts[0], new Module(parts[0], destinations, "broadcaster", "low", new Map(), "low"));
        } else {
            throw new Error("idk");
        }
    }

    for (const l of input) {
        const parts = l.split(" -> ");
        const destinations = parts[1].split(", ");
        const name = ["%", "&"].includes(parts[0][0]) ? parts[0].slice(1) : "broadcaster";
        for (const d of destinations) {
            const dest = modules.get(d);

            if (typeof dest === "undefined") {
                continue;
            }

            dest.rxState.set(name, "low");
        }
    }

    modules.get("broadcaster")?.rxState.set("button", "low");

    let lowTotal = 0;
    let highTotal = 0;
    type State = {
        source: string;
        dest: string;
        txType: Pulse;
    };
    const queue: State[] = [];

    const presses = 1000;
    for (let i = 0; i < presses; ++i) {
        queue.push({ source: "button", dest: "broadcaster", txType: "low" });
        while (queue.length > 0) {
            const { source, dest, txType } = queue.shift()!;
            // console.log(`${source} -${txType}-> ${dest}`);
            if (txType === "high") {
                ++highTotal;
            } else {
                ++lowTotal;
            }

            const module = modules.get(dest);

            if (typeof module === "undefined") {
                continue;
            }

            module.lastRxState = txType;
            module.rxState.set(source, txType);

            const { changed, tx, txType: newTxType } = module.process();
            if (changed) {
                tx.forEach((t) =>
                    queue.push({
                        source: module.name,
                        dest: t,
                        txType: newTxType,
                    })
                );
            }
        }
    }

    return lowTotal * highTotal;
}

export function solve20p2(input: string[]): number {
    const dot = path.join(__dirname, "..", "data", "days", "20", "input.dot");

    fs.writeFileSync(dot, "strict digraph {\n");
    for (const l of input) {
        let better: string = "  ";
        const parts = l.split(" -> ");
        const destinations = parts[1].split(", ");
        let shape = `  "${parts[0]}" [shape="oval"]`;
        if (parts[0][0] === "%") {
            better += `"${parts[0].slice(1)}"`;
            shape = `  "${parts[0].slice(1)}" [shape="rect"]`;
        } else if (parts[0][0] === "&") {
            better += parts[0].slice(1);
            shape = `  "${parts[0].slice(1)}" [shape="diamond"]`;
        } else {
            better += parts[0];
        }

        better += " -> ";
        better += "{";
        better += destinations.join(" ");
        better += "}";

        fs.appendFileSync(dot, better);
        fs.appendFileSync(dot, "\n");
        fs.appendFileSync(dot, shape);
        fs.appendFileSync(dot, "\n");
    }
    fs.appendFileSync(dot, "}\n");

    const modules = new Map<string, Module>();
    modules.set("button", new Module("button", ["broadcaster"], "button", "low", new Map(), "low"));
    for (const l of input) {
        const parts = l.split(" -> ");
        const destinations = parts[1].split(", ");
        if (["%", "&"].includes(parts[0][0])) {
            const name = parts[0].slice(1);
            modules.set(name, new Module(name, destinations, parts[0][0] as ModuleType, "low", new Map(), "low"));
        } else if (parts[0] === "broadcaster") {
            modules.set(parts[0], new Module(parts[0], destinations, "broadcaster", "low", new Map(), "low"));
        } else {
            throw new Error("idk");
        }
    }

    for (const l of input) {
        const parts = l.split(" -> ");
        const destinations = parts[1].split(", ");
        const name = ["%", "&"].includes(parts[0][0]) ? parts[0].slice(1) : "broadcaster";
        for (const d of destinations) {
            const dest = modules.get(d);
            if (typeof dest === "undefined") {
                continue;
            }
            dest.rxState.set(name, "low");
        }
    }

    modules.get("broadcaster")?.rxState.set("button", "low");
    type State = {
        source: string;
        dest: string;
        txType: Pulse;
    };
    const queue: State[] = [];
    const presses = 1000000000000;

    // ss fz fh mf
    const ssCycle: number[] = [];
    let ssCycleFound = false;
    let ssCycleCount = -1;
    const fzCycle: number[] = [];
    let fzCycleFound = false;
    let fzCycleCount = -1;
    const fhCycle: number[] = [];
    let fhCycleFound = false;
    let fhCycleCount = -1;
    const mfCycle: number[] = [];
    let mfCycleCount = -1;
    let mfCycleFound = false;
    for (let i = 1; i < presses; ++i) {
        queue.push({ source: "button", dest: "broadcaster", txType: "low" });
        while (queue.length > 0) {
            const { source, dest, txType } = queue.shift()!;
            // console.log(`${source} -${txType}-> ${dest}`);

            const module = modules.get(dest);
            if (dest === "rx" && txType === "low") {
                console.log(`${source} -${txType}-> ${dest}`);
                return presses;
            }

            if (source === "ss" && txType === "high") {
                ssCycle.push(i);
                const count = ssCycle.length - 1;
                if (
                    count >= 2 &&
                    !ssCycleFound &&
                    ssCycle[count] - ssCycle[count - 1] === ssCycle[count - 1] - ssCycle[count - 2]
                ) {
                    ssCycleCount = ssCycle[count] - ssCycle[count - 1];
                    console.log("ss cycle", ssCycleCount, "count", count);
                    ssCycleFound = true;
                }
            }

            if (source === "fz" && txType === "high") {
                fzCycle.push(i);
                const count = fzCycle.length - 1;
                if (
                    count >= 2 &&
                    !fzCycleFound &&
                    fzCycle[count] - fzCycle[count - 1] === fzCycle[count - 1] - fzCycle[count - 2]
                ) {
                    fzCycleCount = fzCycle[count] - fzCycle[count - 1];
                    console.log("fz cycle", fzCycleCount, "count", count);
                    fzCycleFound = true;
                }
            }

            if (source === "fh" && txType === "high") {
                fhCycle.push(i);
                const count = fhCycle.length - 1;
                if (
                    count >= 2 &&
                    !fhCycleFound &&
                    fhCycle[count] - fhCycle[count - 1] === fhCycle[count - 1] - fhCycle[count - 2]
                ) {
                    fhCycleCount = fhCycle[count] - fhCycle[count - 1];
                    console.log("fh cycle", fhCycleCount, "count", count);
                    fhCycleFound = true;
                }
            }

            if (source === "mf" && txType === "high") {
                mfCycle.push(i);
                const count = mfCycle.length - 1;
                if (
                    count >= 2 &&
                    !mfCycleFound &&
                    mfCycle[count] - mfCycle[count - 1] === mfCycle[count - 1] - mfCycle[count - 2]
                ) {
                    mfCycleCount = mfCycle[count] - mfCycle[count - 1];
                    console.log("mf cycle", mfCycleCount, "count", count);
                    mfCycleFound = true;
                }
            }

            if (mfCycleFound && ssCycleFound && fhCycleFound && fzCycleFound) {
                const a = lcm(mfCycleCount, fzCycleCount);
                const b = lcm(fhCycleCount, ssCycleCount);
                return lcm(a, b);
            }

            if (typeof module === "undefined") {
                continue;
            }
            module.lastRxState = txType;
            module.rxState.set(source, txType);
            const { changed, tx, txType: newTxType } = module.process();
            if (changed) {
                tx.forEach((t) =>
                    queue.push({
                        source: module.name,
                        dest: t,
                        txType: newTxType,
                    })
                );
            }
        }
    }
    return -1;
}
