/* v8 ignore start */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
/* v8 ignore end */
