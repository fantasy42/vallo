import {describe, it, expect} from 'bun:test';

import {
  validateRouteExtended,
  createRouteValidatorExtended,
} from '../src/extended/route-extended';

describe('extended route validation', () => {
  describe('singleton: validateRouteExtended', () => {
    it('should invalidate core reserved routes', () => {
      expect(validateRouteExtended('admin')).toBe(false);
      expect(validateRouteExtended('api')).toBe(false);
    });

    it('should invalidate specific extended technical/brand routes', () => {
      const extendedBlocked = [
        'vendor',
        'dist',
        'build',
        'src',
        'public',
        'static',
      ];

      for (const route of extendedBlocked) {
        expect(validateRouteExtended(route)).toBe(false);
      }
    });

    it('should allow common user-facing slugs not in the extended list', () => {
      expect(validateRouteExtended('portfolio')).toBe(true);
      expect(validateRouteExtended('my-work-2026')).toBe(true);
    });
  });

  describe('factory: createRouteValidatorExtended', () => {
    it('should merge user extensions with BOTH core and extended lists', () => {
      const v = createRouteValidatorExtended({
        extensions: ['my-very-specific-blocked-word'],
      });

      expect(v('auth')).toBe(false);
      expect(v('metrics')).toBe(false);
      expect(v('my-very-specific-blocked-word')).toBe(false);
      expect(v('something-else')).toBe(true);
    });

    it('should maintain existing patterns and boundaries by default', () => {
      const v = createRouteValidatorExtended();

      expect(v('-invalid')).toBe(false);
      expect(v('ab')).toBe(false);
      expect(v('a'.repeat(51))).toBe(false);
    });

    it('should handle complex iterables in options.extensions during merge', () => {
      const customSet = new Set(['blocked-from-set']);
      const v = createRouteValidatorExtended({
        extensions: customSet,
      });

      expect(v('blocked-from-set')).toBe(false);
      expect(v('database')).toBe(false);
    });

    it('should allow overriding CORE pattern while keeping extended list', () => {
      const v = createRouteValidatorExtended({
        pattern: /^[a-z]+$/,
      });

      expect(v('validpath')).toBe(true);
      expect(v('path-with-dash')).toBe(false);
      expect(v('badges')).toBe(false);
    });

    it('should respect the caseSensitive flag across the merged list', () => {
      const v = createRouteValidatorExtended({
        caseSensitive: true,
      });

      expect(v('feedback')).toBe(false);
      expect(v('Feedback')).toBe(true);
    });
  });
});
