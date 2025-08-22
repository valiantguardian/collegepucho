import { notFound } from "next/navigation";

function replaceSitemapUrls(xmlString: string, oldUrl: string, newUrl: string): string {
  return xmlString.replace(new RegExp(oldUrl, 'g'), newUrl);
}

export async function GET(
  req: Request, 
  context: { params: Promise<{ sitemap: string }> }
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_UI_URL || "https://www.collegepucho.com";
    const { sitemap } = await context.params;
    
    // Validate sitemap parameter
    if (!sitemap || typeof sitemap !== 'string') {
      return notFound();
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      console.error('NEXT_PUBLIC_API_URL environment variable is not set');
      return new Response('Internal Server Error', { status: 500 });
    }

    const response = await fetch(`${API_URL}/sitemap/${sitemap}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/xml',
      },
      // Add timeout for production safety
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      console.error(`Sitemap API returned status: ${response.status}`);
      return notFound();
    }

    const xml = await response.text();
    
    // Validate XML content
    if (!xml || xml.trim().length === 0) {
      console.error('Empty sitemap response from API');
      return notFound();
    }

    const processedXml = replaceSitemapUrls(xml, `${API_URL}/sitemap`, baseUrl);
    
    return new Response(processedXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400", // Cache for 1 hour, CDN for 24 hours
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Return a redirect to home page for production
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
}
  