/* eslint-disable no-constant-condition */

import { lcm } from "mathjs";

type Graph = {
    [node: string]: {
        node: string;
        R: string;
        L: string;
    };
};

function parseInput(input: string[]): Graph {
    const obj: Graph = {};
    for (const line of input) {
        const node = line.split("=")[0].trim();
        const L = line.split("=")[1].trim().split(",")[0].substring(1);
        const R = line.split("=")[1].trim().split(",")[1].trim().slice(0, -1);
        obj[node] = { node, L, R };
    }

    return obj;
}

function getNextInstruction(count: number, instructions: `${"L" | "R"}`[]): "L" | "R" {
    return instructions[count % instructions.length];
}

export function solve08p1(input: string[]): number {
    const instructions = input[0].split("") as `${"L" | "R"}`[];
    const graph = parseInput(input.slice(2));
    let count = 0;
    let current = graph["AAA"];
    while (true) {
        if (current.node === "ZZZ") {
            return count;
        }
        const inst = getNextInstruction(count, instructions);
        current = graph[current[inst]];
        ++count;
    }
}

export function solve08p2(input: string[]): number {
    const instructions = input[0].split("") as `${"L" | "R"}`[];
    const graph = parseInput(input.slice(2));
    let count = 0;
    const currentNodes = Object.keys(graph)
        .filter((k) => k.endsWith("A"))
        .map((k) => graph[k]);

    const getsToZ: number[][] = currentNodes.map(() => []);

    while (true) {
        const inst = getNextInstruction(count, instructions);
        ++count;
        for (let ind = 0; ind < currentNodes.length; ++ind) {
            const next = graph[currentNodes[ind][inst]];
            currentNodes[ind] = next;
            if (next.node.endsWith("Z")) {
                getsToZ[ind].push(count);
            }
        }

        if (getsToZ.every((x) => x.length > 0)) {
            return getsToZ.reduce((acc, cur) => lcm(acc, cur[0]), 1);
        }
    }
}
