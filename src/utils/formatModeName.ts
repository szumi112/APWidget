export const formatModeName = (mode: string): string => {
  return mode
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};
