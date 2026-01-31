import { defineEndpoint } from 'toolception';
import { z } from 'zod';
import { getServerVersion } from '../utils/getServerVersion.js';

export const healthCheckEndpoint = defineEndpoint({
  method: 'GET',
  path: '/healthcheck',
  responseSchema: z.object({
    status: z.string(),
    timestamp: z.string(),
    uptime: z.number(),
    sessionManagement: z.string(),
    server: z.object({
      type: z.string(),
      version: z.string(),
    }),
    memoryUsage: z.object({
      rss: z.string(),
      heapTotal: z.string(),
      heapUsed: z.string(),
      external: z.string(),
    }),
  }),
  handler: async () => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      sessionManagement: 'stateful',
      server: {
        type: 'FmpMcpServer',
        version: getServerVersion(),
      },
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB',
      },
    };
  }
});
