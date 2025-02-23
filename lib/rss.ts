import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: ["media:content", "enclosure", "image"],
  },
});

export async function fetchRSSFeeds() {
  const feeds = [
    "https://news.ycombinator.com/rss",
    "https://laravel-news.com/feed",
    "https://javascriptweekly.com/rss/",
    "https://aws.amazon.com/blogs/aws/feed/",
  ];

  const allArticles = [];

  for (const feed of feeds) {
    const parsedFeed = await parser.parseURL(feed);
    allArticles.push(
      ...parsedFeed.items.map((item) => ({
        title: item.title || "No title",
        link: item.link || "#",
        image:
          item["media:content"]?.url ||
          item.enclosure?.url ||
          "https://via.placeholder.com/600x300?text=No+Image",
      }))
    );
  }

  return allArticles;
}