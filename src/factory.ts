import type {Validator, ValidatorOptions} from './types';

/**
 * Creates a high-performance validator function.
 *
 * @param defaults - The core set of reserved words.
 * @param options - Configuration to customize length, patterns, and sensitivity.
 *
 * @returns A validator function.
 */
export function createValidator(
  defaults: ReadonlySet<string>,
  options: ValidatorOptions = {}
): Validator {
  const {
    extensions,
    caseSensitive = false,
    maxLength = 50,
    minLength = 3,
    pattern = null,
  } = options;

  let customSet: Set<string> | null = null;

  if (extensions) {
    customSet = new Set();

    for (const extension of extensions) {
      if (typeof extension !== 'string') {
        continue;
      }

      let normalized = extension.trim();

      if (!caseSensitive) {
        normalized = normalized.toLowerCase();
      }

      if (normalized) {
        customSet.add(normalized);
      }
    }
  }

  return function validate(segment: unknown): boolean {
    if (typeof segment !== 'string' || !segment) {
      return false;
    }

    const rawLength = segment.length;

    // Early exit for massive strings to avoid expensive trim/lowercase operations
    if (rawLength < minLength || rawLength > maxLength + 20) {
      return false;
    }

    const target = caseSensitive
      ? segment.trim()
      : segment.trim().toLowerCase();

    if (target.length < minLength || target.length > maxLength) {
      return false;
    }

    if (pattern && !pattern.test(target)) {
      return false;
    }

    if (defaults.has(target) || customSet?.has(target)) {
      return false;
    }

    return true;
  };
}
