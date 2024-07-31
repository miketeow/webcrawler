function normalizeURL(urlString: string) {
  const urlObject = new URL(urlString);

  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
  if (hostPath.endsWith("/")) {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

export { normalizeURL };
