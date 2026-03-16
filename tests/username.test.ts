import {describe, it, expect} from 'bun:test';

import {validateUsername, createUsernameValidator} from '../src/core/username';

describe('username validation', () => {
  describe('singleton: validateUsername', () => {
    it('should invalidate reserved system handles', () => {
      const reserved = ['about', 'account', 'accounts', 'activate', 'admin'];

      for (const username of reserved) {
        expect(validateUsername(username)).toBe(false);
      }
    });

    it('should allow valid username structures', () => {
      expect(validateUsername('johndoe')).toBe(true);
      expect(validateUsername('john.doe')).toBe(true);
      expect(validateUsername('user123')).toBe(true);
      expect(validateUsername('first.last.01')).toBe(true);
    });

    it('should invalidate dashes', () => {
      expect(validateUsername('john-doe')).toBe(false);
    });

    it('should invalidate strings failing the Username pattern (symbols)', () => {
      expect(validateUsername('john doe')).toBe(false);
      expect(validateUsername('john!@#')).toBe(false);
      expect(validateUsername('john__doe')).toBe(true);
    });

    it('should invalidate dots/underscores at the start or end', () => {
      expect(validateUsername('.john')).toBe(false);
      expect(validateUsername('john.')).toBe(false);
      expect(validateUsername('_john')).toBe(false);
      expect(validateUsername('john_')).toBe(false);
    });

    it('should enforce username-specific length boundaries (3-30)', () => {
      expect(validateUsername('me')).toBe(false);
      expect(validateUsername('abc')).toBe(true);
      expect(validateUsername('a'.repeat(30))).toBe(true);
      expect(validateUsername('a'.repeat(31))).toBe(false);
    });

    it('should handle case-insensitivity by default', () => {
      expect(validateUsername('ADMIN')).toBe(false);
      expect(validateUsername('Support')).toBe(false);
    });
  });

  describe('factory: createUsernameValidator', () => {
    it('should maintain core while adding extensions', () => {
      const v = createUsernameValidator({
        extensions: ['custom-blocked-user'],
      });

      expect(v('admin')).toBe(false);
      expect(v('root')).toBe(false);
      expect(v('null')).toBe(false);
      expect(v('custom-blocked-user')).toBe(false);
      expect(v('active-user-99')).toBe(false);
      expect(v('active.user.99')).toBe(true);
    });

    it('should allow overriding the default username maxLength (30)', () => {
      const v = createUsernameValidator({maxLength: 10});

      expect(v('shortname')).toBe(true);
      expect(v('longusername')).toBe(false);
    });

    it('should allow overriding the USERNAME_PATTERN_CORE', () => {
      const v = createUsernameValidator({
        pattern: /^[a-zA-Z]+$/,
      });

      expect(v('JohnDoe')).toBe(true);
      expect(v('john.doe')).toBe(false);
      expect(v('admin')).toBe(false);
    });

    it('should respect caseSensitive: true for username validation', () => {
      const v = createUsernameValidator({caseSensitive: true});

      expect(v('support')).toBe(false);
      expect(v('SUPPORT')).toBe(true);
    });

    it('should handle complex extensions (Sets) for usernames', () => {
      const v = createUsernameValidator({
        extensions: new Set(['bot', 'service-account']),
      });

      expect(v('bot')).toBe(false);
      expect(v('service-account')).toBe(false);
      expect(v('legit-user')).toBe(false);
      expect(v('legit_user')).toBe(true);
    });
  });
});
