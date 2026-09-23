import { abstention, runEvalCli } from "@anvia/core/evals";
import { createAgent } from "../agents.js";
import { lensClient } from "../lens.js";
import { getModel } from "../models.js";

const agent = createAgent();

await runEvalCli({
  name: "abstention",
  cases: [
    {
      id: "known-policy",
      input:
        "Use only the supplied policy to answer. If it does not contain the answer, say you don't know. Policy: We respond to urgent requests within 30 minutes. How quickly does support respond to urgent requests?",
      expected: false,
      retrievalContext: ["We respond to urgent requests within 30 minutes."],
    },
    {
      id: "unknown-policy",
      input:
        "Use only the supplied policy to answer. If it does not contain the answer, say you don't know. Policy: We respond to urgent requests within 30 minutes. What is the annual refund limit?",
      expected: true,
      retrievalContext: ["We respond to urgent requests within 30 minutes."],
    },
  ],
  target: (input: string) => agent.generate({ prompt: input }),
  metrics: [
    abstention({
      model: getModel(),
      shouldAbstain: ({ case: testCase }) => testCase.expected === true,
    }),
  ],
  format: "pretty",
  exitCode: true,
  reporters: [
    lensClient.evalReporter({
      includePayloads: true,
    }),
  ],
});

await lensClient.flush();
