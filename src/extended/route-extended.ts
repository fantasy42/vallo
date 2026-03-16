import type {Validator, ValidatorOptions} from '../types';

import {createValidator} from '../factory';
import {ROUTE_PATTERN_CORE, ROUTE_RESERVED_CORE} from '../constants';
import {ROUTE_RESERVED_EXTENDED} from './data';

const ALL_ROUTE_RESERVED = new Set([
  ...ROUTE_RESERVED_CORE,
  ...ROUTE_RESERVED_EXTENDED,
]);

/**
 * Validates a URL route segment using core and extended reserved words.
 *
 * @example
 * validateRouteExtended('admin') // false
 * validateRoute('my-project') // true
 */
export const validateRouteExtended: Validator = /* @__PURE__ */ createValidator(
  ALL_ROUTE_RESERVED,
  {
    pattern: ROUTE_PATTERN_CORE,
  }
);

/**
 * Creates a custom route validator based on core and extended route reserved words.
 *
 * @param options - Options to override default route behavior.
 */
export function createRouteValidatorExtended(
  options: ValidatorOptions = {}
): Validator {
  return createValidator(ALL_ROUTE_RESERVED, {
    pattern: ROUTE_PATTERN_CORE,
    ...options,
  });
}
