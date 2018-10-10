function *intersperseFnGen(a, delimFn) {
  let first = true;
  for (const x of a) {
    if (first) first = false;
    else yield delimFn();
    yield x;
  }
}

function intersperseFn(a, delimFn) {
  return [...intersperseFnGen(a, delimFn)];
}

export default {
  intersperseFn
}
