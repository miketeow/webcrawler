import { crawlPage } from "./crawl";

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }
  const baseUrl = process.argv[2];
  console.log(`start crawling ${baseUrl}`);
  const pages = await crawlPage(baseUrl, baseUrl, {});

  for (const page of Object.entries(pages)) {
    console.log(page);
  }
}

main();
