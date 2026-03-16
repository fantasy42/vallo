/**
 * A list of strings to be used for validation.
 */
export type ReservedList = Iterable<string>;

/**
 * Configuration options for creating a validator.
 */
export interface ValidatorOptions {
  /**
   * Custom strings to block in addition to the core defaults.
   */
  extensions?: ReservedList;
  /**
   * If true, validation becomes case-sensitive.
   *
   * @default false (e.g., 'Admin' and 'admin' are both blocked)
   */
  caseSensitive?: boolean;
  /**
   * Maximum character length allowed.
   *
   * @default 50
   */
  maxLength?: number;

  /**
   * Minimum character length allowed.
   *
   * @default 3
   */
  minLength?: number;

  /**
   * A regex pattern to test the segment against.
   * Pass `null` to explicitly disable regex validation.
   *
   * @default null
   */
  pattern?: RegExp | null;
}

/**
 * A function that validates a string input.
 *
 * @returns true if the input is valid/available, false if it is reserved or malformed.
 */
export type Validator = (segment: unknown) => boolean;
