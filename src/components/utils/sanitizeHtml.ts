import * as cheerio from "cheerio";

export const sanitizeHtml = (html: string) => {
  // Normalize some common malformed patterns (e.g., duplicated quotes in attributes)
  // Example: href=""http://example.com"" or width=""319""
  let normalizedHtml = html.replace(/=""([^"']+?)""/g, '="$1"');
  // In case leading stray quotes were added before first element
  normalizedHtml = normalizedHtml.replace(/^"+\s*(<)/, "$1");

  const $ = cheerio.load(normalizedHtml);

  $("script, iframe, object, embed").remove();

  $("[onerror], [onload], [onclick], [onmouseover], [onfocus]").each((_, el) => {
    Object.keys(el.attribs).forEach((attr) => {
      if (attr.startsWith("on")) $(el).removeAttr(attr);
    });
  });

  $("a[href]").each((_, anchor) => {
    const href = $(anchor).attr("href") || "";

    if (!href.includes("collegepucho.in")) {
      $(anchor).attr("rel", "nofollow noopener noreferrer");
      $(anchor).attr("target", "_blank");
    }
  });

  $("table").each((_, table) => {
    const $table = $(table);
    if ($table.find("th").length === 0) {
      const firstRow = $table.find("tr").first();
      firstRow.children("td").each((_, td) => {
        $(td).replaceWith(`<th>${$(td).html()}</th>`);
      });
      firstRow.wrap("<thead></thead>");
    }
  });

  // Return only the inner HTML (avoid wrapping <html>/<body> tags inside a div)
  const bodyHtml = $("body").html();
  if (typeof bodyHtml === "string" && bodyHtml.trim().length > 0) {
    return bodyHtml;
  }
  // Fallback to root inner HTML (handles HTML fragments without <body>)
  const rootHtml = $.root().html() || "";
  return rootHtml;
};
