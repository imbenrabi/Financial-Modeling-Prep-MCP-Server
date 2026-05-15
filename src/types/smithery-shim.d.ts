// Ambient module declaration shim.
//
// @smithery/sdk's package.json maps "./*" -> "./dist/*" but lacks an explicit "types"
// condition. Under NodeNext moduleResolution, TypeScript cannot locate the .d.ts
// files for deep paths through the package's exports map. This declaration mirrors
// the upstream public surface of @smithery/sdk/server/stateful.d.ts so callers
// get type safety without forcing tsconfig "paths" gymnastics. Keep in sync if
// the upstream signature changes.
declare module "@smithery/sdk/server/stateful.js" {
  import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
  import type express from "express";
  import type { z } from "zod";

  export interface CreateServerArg<T = Record<string, unknown>> {
    sessionId: string;
    config: T;
  }

  export type CreateServerFn<T = Record<string, unknown>> = (
    arg: CreateServerArg<T>
  ) => Server;

  export interface StatefulServerOptions<T = Record<string, unknown>> {
    sessionStore?: unknown;
    schema?: z.ZodSchema<T>;
    app?: express.Application;
  }

  export function createStatefulServer<T = Record<string, unknown>>(
    createMcpServer: CreateServerFn<T>,
    options?: StatefulServerOptions<T>
  ): { app: express.Application };
}