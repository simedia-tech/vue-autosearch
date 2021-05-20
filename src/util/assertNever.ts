export function assertNever(prop: never): never {
  throw new Error(`uncaught case for ${prop}`);
}