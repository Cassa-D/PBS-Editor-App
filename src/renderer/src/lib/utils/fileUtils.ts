export const formatPath = (path: string) => {
  if (navigator.platform.includes("Win")) {
    return path.replace("/", "\\");
  }
  return path;
};
