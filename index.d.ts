declare module "@graph-algorithm/minimum-cut" {
    export function mincut<T>(connections: T[]): Generator<T>;
}
