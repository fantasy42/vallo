export * from './types';

export {createRouteValidator, validateRoute} from './core/route';
export {createUsernameValidator, validateUsername} from './core/username';

import {validateRoute} from './core/route';
import {validateUsername} from './core/username';

/**
 * The main vallo object providing access to default validators.
 */
export const vallo = {
  route: validateRoute,
  username: validateUsername,
} as const;
