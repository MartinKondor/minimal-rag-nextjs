import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === '1',

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
  },

  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },

  client: {},
});
