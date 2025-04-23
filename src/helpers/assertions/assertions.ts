/// @dev This assumes that all given `condition`s can be converted to boolean, which is probably fine
export function assert(condition: any, message: string = ''): asserts condition {
  if (!condition) {
    if (message === '') {
      message = 'Assertion failed';
    }
    throw new Error(message);
  }
}

export function unreachable(message: string = ''): never {
  if (message === '') {
    message = 'Unreachable code reached';
  }
  throw new Error(message);
}
