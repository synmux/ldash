/**
 * GET /api/issues
 *
 * The single endpoint that powers the entire dashboard.
 *
 * Behaviour:
 *   - If `runtimeConfig.linearApiKey` is empty → returns a deterministic
 *     mock payload (`source: "mock"`).
 *   - Otherwise → calls Linear, shapes the data, returns it
 *     (`source: "live"`).
 *
 * The client polls this endpoint on a configurable interval (default 10
 * minutes) and renders every view by filtering the payload locally.
 * The API key never leaves the server.
 */

import { getLivePayload } from "../utils/linear";
import { getMockPayload } from "../utils/mockData";
import type { DashboardPayload } from "#shared/types";

export default defineEventHandler(async (event): Promise<DashboardPayload> => {
  const { linearApiKey } = useRuntimeConfig(event);

  // Prevent every layer of caching — this is a polled live feed and we
  // never want a stale response.
  setHeader(event, "Cache-Control", "no-store");

  if (!linearApiKey) {
    return getMockPayload();
  }

  try {
    return await getLivePayload(linearApiKey);
  } catch (err) {
    // Surface Linear errors as a real 502 so the client can show an
    // error state rather than silently degrading to mock data. The
    // dashboard treats this as "polling failed, try again next tick".
    const message = err instanceof Error ? err.message : "Unknown Linear error";
    throw createError({
      statusCode: 502,
      statusMessage: "Linear API request failed",
      data: { message },
    });
  }
});
