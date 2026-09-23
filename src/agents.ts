import { Agent } from "@anvia/core";
import { getModel } from "./models.js";

export function createAgent() {
  return new Agent({
    id: "assistant",
    model: getModel(),
    instructions: "You are a helpful assistant, always cite your sources",
    context: [
      {
        id: "support-policy",
        text: "",
        additionalProps: {
          source: "support-policy-doc",
          version: "v1",
        },
      },
    ],
  });
}
