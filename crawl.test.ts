import { getURLsFromHTML, normalizeURL } from "./crawl";
import { expect, test } from "vitest";

test("normalizeURL strip the protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("normalizeURL strip the trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("normalizeURL capitals", () => {
  const input = "http://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toBe(expected);
});

test("getURLsFromHTML absolute url", () => {
  const input = `
  <html>
    <body>
        <a href="https://blog.boot.dev/path">
            Boot.dev Blog
        </a>
    </body>
  </html>`;
  const inputBaseUrl = "https://blog.boot.dev/path";
  const actual = getURLsFromHTML(input, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative url", () => {
  const input = `
    <html>
      <body>
          <a href="/path/">
              Boot.dev Blog
          </a>
      </body>
    </html>`;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(input, inputBaseUrl);
  const expected = ["https://blog.boot.dev/path/"];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative both", () => {
  const input = `
      <html>
        <body>
            <a href="https://blog.boot.dev/path1">
                Boot.dev Blog Path One
            </a>
            <a href="/path2/">
                Boot.dev Blog Path Two
            </a>
        </body>
      </html>`;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(input, inputBaseUrl);
  const expected = [
    "https://blog.boot.dev/path1",
    "https://blog.boot.dev/path2/",
  ];
  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const input = `
      <html>
        <body>
            <a href="invalid">
                Boot.dev Blog
            </a>
        </body>
      </html>`;
  const inputBaseUrl = "https://blog.boot.dev";
  const actual = getURLsFromHTML(input, inputBaseUrl);
  const expected: string[] = [];
  expect(actual).toEqual(expected);
});
