import { Agent } from "@anvia/core";
import { exactMatch, runEvalCli } from "@anvia/core/evals";
import { z } from "zod";
import { lensClient } from "../lens.js";
import { getModel } from "../models.js";

const agent = new Agent({
  id: "ticket-classifier",
  model: getModel(),
  instructions:
    "Extract the incident ID and classify the request priority as urgent or routine.",
  outputSchema: z.object({
    incidentId: z.string(),
    priority: z.enum(["urgent", "routine"]),
  }),
});

await runEvalCli({
  name: "exact-match",
  cases: [
    {
      id: "production-incident",
      input:
        "Incident INC-204: The production service is down for all customers.",
      expected: { incidentId: "INC-204", priority: "urgent" },
    },
  ],
  target: (input: string) => agent.generate({ prompt: input }),
  metrics: [exactMatch()],
  format: "pretty",
  exitCode: true,
  reporters: [
    lensClient.evalReporter({
      includePayloads: true,
    }),
  ],
});

await lensClient.flush();
