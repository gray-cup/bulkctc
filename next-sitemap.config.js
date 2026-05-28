/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://bulkctc.com",
  generateRobotsTxt: true,
  changefreq: "monthly",
  priority: 0.7,
  transform: async (config, path) => {
    // Homepage gets highest priority
    if (path === "/") {
      return { loc: path, changefreq: "weekly", priority: 1.0, lastmod: new Date().toISOString() };
    }
    // State pages
    if (/^\/[a-z-]+$/.test(path) && path !== "/contact" && path !== "/about" && path !== "/shop" && path !== "/products" && path !== "/sites") {
      return { loc: path, changefreq: "monthly", priority: 0.8, lastmod: new Date().toISOString() };
    }
    // City pages (two path segments)
    if (/^\/[a-z-]+\/[a-z-]+$/.test(path)) {
      return { loc: path, changefreq: "monthly", priority: 0.7, lastmod: new Date().toISOString() };
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() };
  },
};
