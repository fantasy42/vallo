import {describe, it, expect} from 'bun:test';

import {validateRoute, createRouteValidator} from '../src/core/route';

describe('route validation', () => {
  describe('singleton: validateRoute', () => {
    it('should invalidate reserved system and technical routes', () => {
      const technical = [
        'about',
        'account',
        'activate',
        'admin',
        'administrator',
        'alerts',
      ];

      for (const route of technical) {
        expect(validateRoute(route)).toBe(false);
      }
    });

    it('should invalidate brand and impersonation terms (case-insensitive)', () => {
      expect(validateRoute('administrator')).toBe(false);
      expect(validateRoute('ADMINISTRATOR')).toBe(false);
      expect(validateRoute('Cart')).toBe(false);
      expect(validateRoute('Support')).toBe(false);
      expect(validateRoute('checkout')).toBe(false);
    });

    it('should allow valid profile slugs', () => {
      expect(validateRoute('john-doe')).toBe(true);
      expect(validateRoute('jane_smith')).toBe(true);
      expect(validateRoute('alex2024')).toBe(true);
      expect(validateRoute('my-cool-blog')).toBe(true);
    });

    it('should invalidate strings failing the Safe Slug pattern (symbols)', () => {
      expect(validateRoute('john.doe')).toBe(false);
      expect(validateRoute('john doe')).toBe(false);
      expect(validateRoute('john!@#')).toBe(false);
      expect(validateRoute('search?q=1')).toBe(false);
    });

    it('should invalidate symbols at the start or end of the string', () => {
      expect(validateRoute('-admin')).toBe(false);
      expect(validateRoute('admin-')).toBe(false);
      expect(validateRoute('_user')).toBe(false);
      expect(validateRoute('user_')).toBe(false);
    });

    it('should enforce length boundaries (3-50)', () => {
      expect(validateRoute('me')).toBe(false);
      expect(validateRoute('abc')).toBe(true);
      expect(validateRoute('a'.repeat(50))).toBe(true);
      expect(validateRoute('a'.repeat(51))).toBe(false);
    });

    it('should treat non-string or empty inputs as invalid', () => {
      expect(validateRoute('')).toBe(false);
      expect(validateRoute(null)).toBe(false);
      expect(validateRoute(undefined)).toBe(false);
    });
  });

  describe('factory: createRouteValidator', () => {
    it('should maintain CORE reserved words while adding extensions', () => {
      const v = createRouteValidator({
        extensions: ['my-custom-reserved'],
      });

      expect(v('admin')).toBe(false);
      expect(v('_next')).toBe(false);
      expect(v('my-custom-reserved')).toBe(false);
      expect(v('available-route')).toBe(true);
    });

    it('should allow overriding default length constraints', () => {
      const v = createRouteValidator({
        minLength: 1,
        maxLength: 5,
      });

      expect(v('a')).toBe(true);
      expect(v('abcde')).toBe(true);
      expect(v('abcdef')).toBe(false);
    });

    it('should allow disabling regex validation via null pattern', () => {
      const v = createRouteValidator({
        pattern: null,
      });
      expect(v('user@name!')).toBe(true);
      expect(v('admin')).toBe(false);
    });

    it('should respect caseSensitive toggle for both CORE and extensions', () => {
      const v = createRouteValidator({
        extensions: ['Custom-Path'],
        caseSensitive: true,
      });

      expect(v('admin')).toBe(false);
      expect(v('ADMIN')).toBe(true);
      expect(v('Custom-Path')).toBe(false);
      expect(v('custom-path')).toBe(true);
    });

    it('should handle different Iterable types (Set) in extensions', () => {
      const extensions = new Set(['from-set', 'another-one']);
      const v = createRouteValidator({extensions});

      expect(v('from-set')).toBe(false);
      expect(v('another-one')).toBe(false);
      expect(v('valid-path')).toBe(true);
    });

    it('should prevent prototype pollution or non-string extension attacks', () => {
      const v = createRouteValidator({
        extensions: ['__proto__', 123, null] as unknown as string[],
      });

      expect(v('__proto__')).toBe(false);
      expect(v('123')).toBe(true);
    });
  });
});
