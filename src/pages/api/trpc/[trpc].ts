import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

const fetchHolidays = async () => {
  return await fetch('https://webapi.no/api/v1/holidays/2022')
    .then((response) => response.json())
    .then((data) => data);
};

export const appRouter = trpc.router().query('get-holidays', {
  output: z.object({
    authenticated: z.boolean(),
    data: z.array(z.object({ date: z.string(), description: z.string() })),
    statusCode: z.number(),
    timeTaken: z.number(),
  }),
  async resolve() {
    return await fetchHolidays();
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
