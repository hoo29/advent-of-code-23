import "regenerator-runtime/runtime.js";
import { mincut } from "@graph-algorithm/minimum-cut";
import assert from "assert";

type Node = {
    name: string;
    con: Set<string>;
};

export function solve25p1(input: string[]) {
    const all = new Map<string, Node>();
    const edgesArray: [string, string][] = [];
    for (const c of input) {
        const parts = c.split(": ");
        const name = parts[0];
        const other = parts[1].split(" ");
        const existing = all.get(name) ?? { name, con: new Set() };
        existing.con = new Set([...existing.con, ...other]);

        all.set(name, existing);
        for (const o of other) {
            const on = all.get(o) ?? { name: o, con: new Set() };
            on.con.add(name);
            all.set(o, on);
            edgesArray.push([name, o]);
        }
    }

    for (const [from, to] of mincut(edgesArray)) {
        console.log(from, to);
        all.get(from)?.con.delete(to);
        all.get(to)?.con.delete(from);
    }

    const allNodes = Array.from(all.keys());
    const seen = new Set<string>();
    const queue: string[] = [allNodes[0]];
    while (queue.length > 0) {
        const node = queue.pop();
        assert(node);
        if (seen.has(node)) {
            continue;
        }
        seen.add(node);
        const other = all.get(node)!;
        queue.push(...Array.from([...other.con]));
    }

    return seen.size * (allNodes.length - seen.size);
}
