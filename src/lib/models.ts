// Verifo's fallback inference runs on Claude behind the scenes (via an internal AI proxy), but that's an internal implementation detail — the UI
// should only ever show Verifo-branded model names to end users. The
// `value` sent to the backend must stay a real Anthropic model ID since
// that's what the /tasks endpoint actually accepts; only the user-facing
// `label` is rebranded.
export const MODEL_OPTIONS = [
  { value: "claude-sonnet-4-6", label: "Verifo Core (balanced)" },
  { value: "claude-opus-4-8", label: "Verifo Max (most capable)" },
  { value: "claude-haiku-4-5", label: "Verifo Flash (fastest)" },
];

const MODEL_LABELS: Record<string, string> = Object.fromEntries(
  MODEL_OPTIONS.map((m) => [m.value, m.label])
);

// Used anywhere a raw model id/slug from the backend (e.g. task history)
// needs to be shown to the user. Falls back to a generic "Verifo Network"
// label for anything we don't have a branded name for, so no internal
// provider name ever leaks through unrecognized values either.
export function getModelLabel(modelId: string | undefined | null): string {
  if (!modelId) return "Verifo Network";
  const slug = modelId.split("/").pop() || modelId;
  return MODEL_LABELS[slug] ?? "Verifo Network";
}
