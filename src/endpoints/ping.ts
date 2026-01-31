import { defineEndpoint } from 'toolception';
import { z } from 'zod';

export const pingEndpoint = defineEndpoint({
  method: 'GET',
  path: '/ping',
  responseSchema: z.object({
    status: z.literal('ok')
  }),
  handler: async () => ({ status: 'ok' as const })
});
