import { orgLD, websiteLD } from "@/lib/schema";
import Script from "next/script";

function GTMScript({ gtmId }: { gtmId: string }) {
  if (!gtmId) return null;
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gtmId}`}
        strategy="lazyOnload"
      />
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtmId}');
          `,
        }}
        strategy="lazyOnload"
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLD) }}
        />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLD) }}
        />
        <GTMScript gtmId="G-5CMGT07LVZ" />
        {children}
      </body>
    </html>
  );
}
