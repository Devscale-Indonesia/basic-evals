import { faithfulness, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agents.js";
import { lensClient } from "../lens.js";
import { getModel } from "../models.js";

const agent = createAgent();

await runEvalCli({
  name: "faithfulness",
  cases: [
    {
      id: "support-response-time",
      input:
        "Answer using only this support policy: We respond to urgent requests within 30 minutes. How quickly does support respond to urgent requests?",
      retrievalContext: ["We respond to urgent requests within 30 minutes."],
    },
  ],
  target: (input: string) => agent.generate({ prompt: input }),
  metrics: [faithfulness({ model: getModel() })],
  format: "pretty",
  exitCode: true,
  reporters: [
    lensClient.evalReporter({
      includePayloads: true,
    }),
  ],
});

await lensClient.flush();
