/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

const ALL_PARTS = ["x", "m", "a", "s"] as const;

type PartComponent = (typeof ALL_PARTS)[number];

interface BaseRule {
    action: string;
}

interface Rule extends BaseRule {
    partComponent: PartComponent;
    condition: "<" | ">";
    amount: number;
}

interface Workflow {
    [name: string]: {
        name: string;
        rules: Array<Rule | BaseRule>;
    };
}

type Part = {
    [p in PartComponent]: number;
};

type Constraints = {
    [p in PartComponent]: {
        [s in ">" | "<"]: number[];
    };
};

function parseInput(input: string[]) {
    const workflows: Workflow = {};
    const parts: Part[] = [];
    for (const line of input) {
        if (line === "") {
            continue;
        } else if (line[0] === "{") {
            const part = line
                .slice(1, -1)
                .split(",")
                .reduce<Part>((acc, x) => {
                    acc[x.split("=")[0] as PartComponent] = Number(x.split("=")[1]);
                    return acc;
                }, {} as Part);
            parts.push(part);
        } else {
            const start = line.indexOf("{");
            const name = line.slice(0, start);
            const rawRules = line.slice(start + 1, -1).split(",");
            const rules: Array<Rule | BaseRule> = [];
            workflows[name] = { name, rules };
            for (const rule of rawRules) {
                const end = rule.indexOf(":");
                if (ALL_PARTS.includes(rule[0] as any) && ["<", ">"].includes(rule[1])) {
                    rules.push({
                        partComponent: rule[0] as any,
                        condition: rule[1] as any,
                        amount: Number(rule.slice(2, end)),
                        action: rule.slice(end + 1),
                    });
                } else {
                    rules.push({
                        action: rule,
                    });
                }
            }
        }
    }

    return { workflows, parts };
}

function isRule(r: BaseRule | Rule): r is Rule {
    return typeof (r as Rule).partComponent !== "undefined";
}

function checkCondition(part: Part, rule: Rule): boolean {
    if (rule.condition === ">") {
        return part[rule.partComponent] > rule.amount;
    } else {
        return part[rule.partComponent] < rule.amount;
    }
}

export function solve19p1(input: string[]): number {
    const { workflows, parts } = parseInput(input);

    let sum = 0;

    for (const part of parts) {
        let workflow = workflows["in"];
        let done = false;
        while (!done) {
            for (const rule of workflow.rules) {
                if (!isRule(rule) || checkCondition(part, rule)) {
                    if (rule.action === "A") {
                        sum += Object.values(part).reduce((acc, p) => (acc += p));
                        done = true;
                    } else if (rule.action === "R") {
                        done = true;
                    } else {
                        workflow = workflows[rule.action];
                    }
                    break;
                }
            }
        }
    }

    return sum;
}

function copyConstraints(c: Constraints) {
    const constraints: Constraints = {
        x: { ">": [], "<": [] },
        m: { ">": [], "<": [] },
        a: { ">": [], "<": [] },
        s: { ">": [], "<": [] },
    };
    for (const [k, v] of Object.entries(c)) {
        constraints[k as PartComponent][">"] = [...v[">"]];
        constraints[k as PartComponent]["<"] = [...v["<"]];
    }

    return constraints;
}

export function solve19p2(input: string[]): number {
    const { workflows } = parseInput(input);

    type State = {
        name: string;
        path: string[];
        constraints: Constraints;
    };

    const queue: State[] = [];
    queue.push({
        name: "in",
        path: [],
        constraints: {
            x: { ">": [], "<": [] },
            m: { ">": [], "<": [] },
            a: { ">": [], "<": [] },
            s: { ">": [], "<": [] },
        },
    });

    const a = [];
    const r = [];

    while (queue.length > 0) {
        const item = queue.shift();
        if (typeof item === "undefined") {
            throw new Error("why");
        }

        if (item.name === "A") {
            a.push(item);
            continue;
        }

        if (item.name === "R") {
            r.push(item);
            continue;
        }

        const workflow = workflows[item.name];

        for (let ind = 0; ind < workflow.rules.length; ++ind) {
            const rule = workflow.rules[ind];

            // copy existing constraints
            const constraints = copyConstraints(item.constraints);

            // inverse previous rules in the workflow
            for (let subInd = 0; subInd < ind; ++subInd) {
                const subRule = workflow.rules[subInd] as Rule;
                const newOp = subRule.condition === ">" ? "<" : ">";
                const newAmount = newOp === ">" ? subRule.amount - 1 : subRule.amount + 1;
                constraints[subRule.partComponent][newOp].push(newAmount);
            }

            if (isRule(rule)) {
                constraints[rule.partComponent][rule.condition].push(rule.amount);
            }

            queue.push({
                name: rule.action,
                path: [...item.path, item.name],
                constraints,
            });
        }
    }

    let valid = 0;
    for (const accepted of a) {
        let pathValid = 1;
        for (const key of ALL_PARTS) {
            const end = Math.min(...accepted.constraints[key]["<"], 4001);
            const start = Math.max(...accepted.constraints[key][">"], 0) + 1;
            pathValid *= end - start;
        }
        valid += pathValid;
    }

    return valid;
}
