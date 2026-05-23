import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItGitHubAlerts from "markdown-it-github-alerts";
import { fromHighlighter } from "@shikijs/markdown-it/core";
import { createHighlighter } from "shiki";

export default async function (eleventyConfig) {

  // ── Passthrough: CSS / JS / Assets ─────────────────────────────
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/subpage-styles.css");
  eleventyConfig.addPassthroughCopy("src/blog-styles.css");
  eleventyConfig.addPassthroughCopy("src/animations.js");
  eleventyConfig.addPassthroughCopy("src/img");

  // ── Passthrough: Root-level static files ────────────────────────
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/llms.txt");
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy("src/google6182183c97042d14.html");

  // ── Passthrough: Homepage & 404 (modified HTML, not templated) ──
  eleventyConfig.addPassthroughCopy("src/index.html");
  eleventyConfig.addPassthroughCopy("src/404.html");

  // ── Passthrough: All existing project pages verbatim ────────────
  eleventyConfig.addPassthroughCopy("src/ember");
  eleventyConfig.addPassthroughCopy("src/enclv");
  eleventyConfig.addPassthroughCopy("src/fynn");
  eleventyConfig.addPassthroughCopy("src/mission");
  eleventyConfig.addPassthroughCopy("src/monei");
  eleventyConfig.addPassthroughCopy("src/screenplaygenie");
  eleventyConfig.addPassthroughCopy("src/unicam");
  eleventyConfig.addPassthroughCopy("src/digitalgarage");

  // ── Template engine: only .njk and .md ──────────────────────────
  eleventyConfig.setTemplateFormats(["njk", "md"]);

  // ── Shiki Syntax Highlighting ────────────────────────────────────
  const highlighter = await createHighlighter({
    themes: ["github-dark-default", "github-light-default"],
    langs: [
      "swift", "javascript", "typescript", "html", "css",
      "bash", "json", "markdown", "python", "solidity", "text"
    ],
  });

  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.linkInsideHeader({
        symbol: `<span aria-hidden="true">#</span>`,
        placement: "after",
      }),
    })
    .use(markdownItGitHubAlerts)
    .use(
      fromHighlighter(highlighter, {
        themes: { dark: "github-dark-default", light: "github-light-default" },
      })
    );

  eleventyConfig.setLibrary("md", md);

  // ── RSS Plugin ───────────────────────────────────────────────────
  eleventyConfig.addPlugin(pluginRss);

  // ── Collections ──────────────────────────────────────────────────
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date)
  );

  // ── Filters ──────────────────────────────────────────────────────
  eleventyConfig.addFilter("readableDate", (d) => {
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric", timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("isoDate", (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    const match = content.match(/<p>([\s\S]*?)<\/p>/);
    return match ? match[1].replace(/<[^>]+>/g, "") : "";
  });

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    return new URL(url, base).href;
  });

  eleventyConfig.addFilter("resolveOgImage", (ogImage, image, content, siteUrl) => {
    let imgUrl = ogImage || image;
    if (imgUrl && (imgUrl.includes("IMG_7799.png") || imgUrl.includes("avatar"))) {
      imgUrl = null;
    }
    if (!imgUrl && content) {
      const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        const src = match[1];
        if (!src.includes("IMG_7799.png") && !src.includes("avatar")) {
          imgUrl = src;
          break;
        }
      }
    }
    if (!imgUrl) {
      return "";
    }
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      return imgUrl;
    }
    const path = imgUrl.startsWith("/") ? imgUrl : `/${imgUrl}`;
    return `${siteUrl}${path}`;
  });

  // ── Return config ─────────────────────────────────────────────────
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
  };
}
