import { JSDOM } from "jsdom";

async function crawlPage(baseURL: string, currentURL: string, pages: any) {
  const baseURLObject = new URL(baseURL);
  const currentURLObject = new URL(currentURL);
  if (baseURLObject.hostname !== currentURLObject.hostname) {
    return pages;
  }

  const normalizeCurrentURL = normalizeURL(currentURL);
  if (pages[normalizeCurrentURL] > 0) {
    pages[normalizeCurrentURL]++;
    return pages;
  }

  pages[normalizeCurrentURL] = 1;
  console.log(`actively crawling ${currentURL}`);

  try {
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(
        `Error in fetch: status code ${response.status}, on page${currentURL}`
      );
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("text/html")) {
      console.log(
        `Error in fetch: content type ${contentType}, on page${currentURL}`
      );
      return pages;
    }
    const htmlBody = await response.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.log(`Error in fetch: ${errorMessage}, on page${currentURL}`);
  }
  return pages;
}

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

export { normalizeURL, getURLsFromHTML, crawlPage };
