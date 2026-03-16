import type {Validator, ValidatorOptions} from '../types';

import {createValidator} from '../factory';
import {USERNAME_RESERVED_CORE, USERNAME_PATTERN_CORE} from '../constants';

/**
 * Validates a username using core reserved words and common username patterns.
 *
 * @example
 * validateUsername('root') // false
 * validateUsername('john_doe') // true
 */
export const validateUsername: Validator = /* @__PURE__ */ createValidator(
  USERNAME_RESERVED_CORE,
  {
    pattern: USERNAME_PATTERN_CORE,
    maxLength: 30,
  }
);

/**
 * Creates a custom username validator based on core username reserved words.
 *
 * @param options - Options to override default username behavior.
 */
export function createUsernameValidator(
  options: ValidatorOptions = {}
): Validator {
  return createValidator(USERNAME_RESERVED_CORE, {
    pattern: USERNAME_PATTERN_CORE,
    maxLength: 30,
    ...options,
  });
}
