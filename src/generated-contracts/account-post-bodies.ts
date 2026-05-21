import { z } from "zod"

export const accountCreateApiKeyBodySchema = z
  .object({
    /** SDK-PY always includes keys; omitted args serialize as JSON `null`. */
    scopes: z.array(z.string()).nullish(),
    livemode: z.boolean().nullish(),
    label: z.string().nullish(),
  })
  .passthrough()
