// Public surface of the quickAdd feature. Anything not re-exported here
// is internal — outside callers should not reach in.

export { QUICK_ADD_CONFIG } from "./config/quickAddConfig";
export { realClock, fixedClock } from "./domain/clock";
export { parseQuickInput } from "./domain/parseQuickInput";
export { useQuickAdd } from "./ui/useQuickAdd";
export { default as QuickAddInput } from "./ui/QuickAddInput";
export { default as QuickAddModal } from "./ui/QuickAddModal";
