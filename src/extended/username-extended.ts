import type {Validator, ValidatorOptions} from '../types';

import {createValidator} from '../factory';
import {USERNAME_PATTERN_CORE, USERNAME_RESERVED_CORE} from '../constants';
import {USERNAME_RESERVED_EXTENDED} from './data';

const ALL_ROUTE_RESERVED = new Set([
  ...USERNAME_RESERVED_CORE,
  ...USERNAME_RESERVED_EXTENDED,
]);

/**
 * Validates a username using core and extended reserved words.
 *
 * @example
 * validateUsernameExtended('root') // false
 * validateUsernameExtended('john_doe') // true
 */
export const validateUsernameExtended: Validator =
  /* @__PURE__ */ createValidator(ALL_ROUTE_RESERVED, {
    pattern: USERNAME_PATTERN_CORE,
    maxLength: 30,
  });

/**
 * Creates a custom username validator based on core and extended reserved words.
 *
 * @param options - Options to override default username behavior.
 */
export function createUsernameValidatorExtended(
  options: ValidatorOptions = {}
): Validator {
  return createValidator(ALL_ROUTE_RESERVED, {
    pattern: USERNAME_PATTERN_CORE,
    maxLength: 30,
    ...options,
  });
}
