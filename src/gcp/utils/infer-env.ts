export function isLocal(): boolean {
  // if no knative vars, then this is likely running locally
  return !(process.env.K_SERVICE && process.env.K_REVISION);
}

export function getEnvironment(): "production" | "staging" | "development" {
  const env = process.env.NODE_ENV?.toLocaleLowerCase();
  if (env?.startsWith("prod")) {
    return "production";
  } else if (env?.startsWith("staging")) {
    return "staging";
  } else {
    return "development";
  }
}
