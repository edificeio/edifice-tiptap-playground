export function debounceAggregate<INPUT, OUTPUT>(
  delay: number,
  map: (input: INPUT) => OUTPUT,
  callback: (aggregated: OUTPUT[]) => void,
): (arg: INPUT) => void {
  let timerId: number | undefined;
  const pending: OUTPUT[] = [];
  return function (arg: INPUT) {
    if (timerId) {
      clearTimeout(timerId);
    }
    pending.push(map(arg));
    timerId = setTimeout(() => {
      const copy = [...pending];
      // remove all
      pending.splice(0, pending.length);
      // call with aggregated
      callback(copy);
    }, delay) as unknown as number;
  };
}
