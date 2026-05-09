// Clock seam: date logic depends on this interface, not on `new Date()`,
// so tests / Storybook can pin time without touching globals.

export const realClock = {
  now: () => new Date(),
};

export const fixedClock = (isoOrDate) => ({
  now: () => new Date(isoOrDate),
});
