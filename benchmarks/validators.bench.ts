import {bench, group, run, summary} from 'mitata';

import {validateRoute, createRouteValidator} from '../src/core/route';
import {validateUsername} from '../src/core/username';
import {validateRouteExtended} from '../src/extended/route-extended';
import {validateUsernameExtended} from '../src/extended/username-extended';

const massiveList = Array.from(
  {length: 10_000},
  (_, index) => `path-segment-indexed-${index}`
);

const heavyValidator = createRouteValidator({
  extensions: massiveList,
  maxLength: 100,
});

const legacyValidate = (segment: unknown, list: string[]) => {
  if (typeof segment !== 'string') {
    return false;
  }

  const target = segment.trim().toLowerCase();

  for (const item of list) {
    if (item === target) return false;
  }

  return true;
};

group('scalability: o(1) set vs list size', () => {
  bench('route core (~40)', () => validateRoute('my-unique-slug'));
  bench('route extended (100+)', () => validateRouteExtended('my-unique-slug'));
  bench('username core (~20)', () => validateUsername('user123'));
  bench('username extended (100+)', () => validateUsernameExtended('user123'));
});

group('large dataset (10k items) analysis', () => {
  summary(() => {
    bench('o(1) set search (production)', () =>
      heavyValidator('path-segment-indexed-9999')
    );

    bench('o(n) array search (legacy)', () =>
      legacyValidate('path-segment-indexed-9999', massiveList)
    );
  });
});

group('logic gate efficiency', () => {
  const longString = 'a'.repeat(200);

  bench('early exit: length check', () => validateRoute(longString));
  bench('standard path: valid unique', () => validateRoute('valid-slug'));
  bench('type safety: non-string', () => validateRoute(null));
});

group('engine baselines', () => {
  const string = 'some-longer-string-to-transform';
  const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;

  bench('string .tolowercase()', () => string.toLowerCase());
  bench('regex .test()', () => regex.test('somepath'));
});

await run();
