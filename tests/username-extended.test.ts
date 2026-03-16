import {describe, it, expect} from 'bun:test';

import {
  validateUsernameExtended,
  createUsernameValidatorExtended,
} from '../src/extended/username-extended';

describe('extended username validation', () => {
  describe('singleton: validateUsernameExtended', () => {
    it('should invalidate core username reserved words', () => {
      expect(validateUsernameExtended('admin')).toBe(false);
      expect(validateUsernameExtended('root')).toBe(false);
    });

    it('should invalidate extended team and service roles', () => {
      const extendedBlocked = [
        'postgres',
        'postgresql',
        'redis',
        'memcached',
        'mongodb',
      ];

      for (const username of extendedBlocked) {
        expect(validateUsernameExtended(username)).toBe(false);
      }
    });

    it('should allow valid, non-reserved usernames', () => {
      expect(validateUsernameExtended('creative.coder')).toBe(true);
      expect(validateUsernameExtended('dev_user_2026')).toBe(true);
    });
  });

  describe('factory: createUsernameValidatorExtended', () => {
    it('should merge user extensions with core AND extended username lists', () => {
      const v = createUsernameValidatorExtended({
        extensions: ['custom-blocked-handle'],
      });

      expect(v('system')).toBe(false);
      expect(v('dhcp')).toBe(false);
      expect(v('custom-blocked-handle')).toBe(false);
      expect(v('generic.user')).toBe(true);
    });

    it('should handle the spread of Set/Array extensions correctly', () => {
      const v = createUsernameValidatorExtended({
        extensions: ['added-via-array'],
      });

      expect(v('added-via-array')).toBe(false);
      expect(v('founder')).toBe(false);
    });

    it('should respect the 30 character limit inherited from username defaults', () => {
      const v = createUsernameValidatorExtended();
      const longUsername = 'a'.repeat(31);

      expect(v(longUsername)).toBe(false);
    });

    it('should respect case sensitivity across the entire merged stack', () => {
      const v = createUsernameValidatorExtended({
        caseSensitive: true,
      });

      expect(v('administrator')).toBe(false);
      expect(v('Administrator')).toBe(true);
    });
  });
});
