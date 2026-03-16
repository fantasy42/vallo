import type {Validator, ValidatorOptions} from '../types';

import {createValidator} from '../factory';
import {ROUTE_RESERVED_CORE, ROUTE_PATTERN_CORE} from '../constants';

/**
 * Validates a URL route segment using core reserved words and URL-safe patterns.
 *
 * @example
 * validateRoute('admin') // false
 * validateRoute('my-project') // true
 */
export const validateRoute: Validator = /* @__PURE__ */ createValidator(
  ROUTE_RESERVED_CORE,
  {
    pattern: ROUTE_PATTERN_CORE,
  }
);

/**
 * Creates a custom route validator based on core route reserved words.
 *
 * @param options - Options to override default route behavior.
 */
export function createRouteValidator(options: ValidatorOptions): Validator {
  return createValidator(ROUTE_RESERVED_CORE, {
    pattern: ROUTE_PATTERN_CORE,
    ...options,
  });
}
