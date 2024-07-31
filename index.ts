import { crawlPage } from "./crawl";

function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }
  const baseUrl = process.argv[2];
  console.log(`start crawling ${baseUrl}`);
  crawlPage(baseUrl);
}

main();
