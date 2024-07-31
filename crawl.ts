import { JSDOM } from "jsdom";
function getURLsFromHTML(htmlBody: string, baseURL: string) {
  const urls: string[] = [];
  const dom = new JSDOM(htmlBody);
  const document = dom.window.document;
  const anchors = document.querySelectorAll("a");
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (href?.slice(0, 1) === "/") {
      urls.push(`${baseURL}${href}`);
    } else {
      try {
        const urlObject = new URL(href!);
        urls.push(href!);
      } catch (error) {
        console.log(`Invalid URL: ${href}`);
      }
    }
  }
  //   const regex = /<a\s+href="([^"]+)"/g;
  //   let match;
  //   while ((match = regex.exec(htmlBody)) !== null) {
  //     urls.push(normalizeURL(match[1]));
  //   }
  return urls;
}
function normalizeURL(urlString: string) {
  const urlObject = new URL(urlString);

  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;
  if (hostPath.endsWith("/")) {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

export { normalizeURL, getURLsFromHTML };
