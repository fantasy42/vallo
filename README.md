# Vallo

[![npm version](https://badge.fury.io/js/%40fantasy42%2Fvallo.svg)](https://badge.fury.io/js/%40fantasy42%2Fvallo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](https://www.npmjs.com/package/@fantasy42/vallo)
[![Tree Shakeable](https://img.shields.io/badge/tree--shakeable-yes-green.svg)](https://www.npmjs.com/package/@fantasy42/vallo)

A lightweight, zero-dependency validation engine for dynamic strings and reserved identifiers in TypeScript. Perfect for validating routes, usernames, and custom identifiers with built-in security checks.

## ✨ Features

- 🚀 **Zero Dependencies** - No external libraries, just pure TypeScript
- 📦 **Tree Shakeable** - Only bundle what you use
- 🔒 **Security First** - Blocks reserved system words and impersonation terms
- 🎯 **Type Safe** - Full TypeScript support with strict typing
- ⚡ **Fast** - Optimized for performance with minimal overhead
- 🛠️ **Customizable** - Extend with your own reserved lists and validation rules
- 📱 **ESM & CommonJS** - Supports both module systems

## 📦 Installation

```bash
npm install @fantasy42/vallo
```

or

```bash
yarn add @fantasy42/vallo
```

or

```bash
pnpm add @fantasy42/vallo
```

## 🚀 Quick Start

```typescript
import { vallo } from '@fantasy42/vallo';

// Validate a route
if (vallo.route('my-profile')) {
  console.log('Route is available!');
} else {
  console.log('Route is reserved or invalid');
}

// Validate a username
if (vallo.username('john.doe')) {
  console.log('Username is valid!');
}
```

## 📚 API Reference

### Core Validators

#### `vallo.route(segment: unknown): boolean`

Validates route segments against reserved system routes and brand terms.

```typescript
vallo.route('admin'); // false - reserved
vallo.route('my-route'); // true - valid
```

#### `vallo.username(segment: unknown): boolean`

Validates usernames with alphanumeric characters, dots, and underscores.

```typescript
vallo.username('root'); // false - reserved
vallo.username('user-name'); // false - dashes not allowed
vallo.username('username123'); // true
```

### Custom Validators

Create your own validators with custom rules by extending the core validators:

```typescript
import { createUsernameValidator } from '@fantasy42/vallo';

// Custom username validator for a social platform
const socialUsernameValidator = createUsernameValidator({
  extensions: ['blocked-name-1', 'blocked-name-2'],
  caseSensitive: false, // Default: case-insensitive
  maxLength: 25,
  minLength: 3,
  pattern: /^[a-zA-Z0-9._-]+$/ // Alphanumeric, dots, underscores, dashes
});

// Usage examples
console.log(socialUsernameValidator('john.doe')); // true
console.log(socialUsernameValidator('blocked-name-1')); // false (in extensions)
console.log(socialUsernameValidator('user_name')); // true
console.log(socialUsernameValidator('user@name')); // false (special chars not allowed)
```

### Extended Validators

For advanced use cases, import from the extended module:

```typescript
import { createExtendedRouteValidator } from '@fantasy42/vallo/extended';
```

### Integration with Frameworks

**Important:** Always validate and sanitize user inputs before processing. Use libraries like [Zod](https://zod.dev/) for robust input validation to prevent injection attacks and ensure data integrity.

#### Express.js Route Validation

```typescript
import express from 'express';
import { z } from 'zod';
import { vallo } from '@fantasy42/vallo';

const app = express();
app.use(express.json());

// Input validation schema
const routeSchema = z
  .string()
  .min(1)
  .max(50)
  .trim()

app.get('/:route', (req, res) => {
  // Validate input first
  const validation = routeSchema.safeParse(req.params.route);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid route format' });
  }

  const route = validation.data;

  // Then check against reserved words
  if (!vallo.route(route)) {
    return res.status(400).json({ error: 'Route is reserved or invalid' });
  }

  res.json({ message: `Route ${route} is valid and available` });
});
```

#### React Form Validation

```typescript
import React, { useState } from 'react';
import { z } from 'zod';
import { vallo } from '@fantasy42/vallo';

// Input validation schema
const usernameSchema = z
  .string()
  .min(3)
  .max(30)
  .trim()

function UsernameForm() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input format first
    const validation = usernameSchema.safeParse(username);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    const cleanUsername = validation.data;

    // Then check against reserved words and patterns
    if (!vallo.username(cleanUsername)) {
      setError('Username is reserved or invalid.');
      return;
    }

    // Submit form
    console.log('Username is valid:', cleanUsername);
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🔧 Configuration Options

All validators support the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extensions` | `ReservedList` | `undefined` | Additional reserved words to block |
| `caseSensitive` | `boolean` | `false` | Whether validation is case-sensitive |
| `maxLength` | `number` | `50` | Maximum allowed length |
| `minLength` | `number` | `3` | Minimum allowed length |
| `pattern` | `RegExp \| null` | `null` | Custom regex pattern to match against |

## 🏗️ TypeScript Support

Vallo is written in TypeScript and provides full type safety:

```typescript
import type { Validator, ValidatorOptions } from '@fantasy42/vallo';

// Types are exported for advanced usage
const options: ValidatorOptions = {
  extensions: ['forbidden'],
  caseSensitive: true
};

const validator: Validator = createRouteValidator(options);
```

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using TypeScript
- Inspired by the need for secure, type-safe validation in modern web apps

---

Made with ❤️ by [Fantasy](https://github.com/fantasy42)
