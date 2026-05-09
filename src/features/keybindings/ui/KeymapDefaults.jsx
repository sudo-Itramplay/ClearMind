import { useKeyAction } from "./KeymapProvider";

const SCROLL_STEP_PX = 120;

// Out-of-the-box vim-flavoured page-scroll bindings. Mounted as a sibling
// of the routed views so it lives for the whole app session. Doesn't ship
// any DOM — only registrations.
const KeymapDefaults = () => {
  useKeyAction("scrollDown", () => window.scrollBy({ top: SCROLL_STEP_PX, behavior: "smooth" }));
  useKeyAction("scrollUp",   () => window.scrollBy({ top: -SCROLL_STEP_PX, behavior: "smooth" }));
  useKeyAction("scrollTop",  () => window.scrollTo({ top: 0, behavior: "smooth" }));
  useKeyAction("scrollBot",  () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }));
  return null;
};

export default KeymapDefaults;
