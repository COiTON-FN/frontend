import * as React from "react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site.config";

interface SEOProps {
  page?: keyof typeof siteConfig.sitemap;
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  keywords?: Array<string>;
  override?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  page = "default",
  title,
  description,
  image = "/og-image.png",
  noindex = false,
  keywords,
  override = false,
}) => {
  const pageConfig = siteConfig.sitemap[page];
  const seoTitle = title || pageConfig.title;
  const seoDescription =
    description ||
    pageConfig.description ||
    siteConfig.sitemap.default.description;
  const fullTitle = override
    ? seoTitle
    : `${seoTitle} • ${siteConfig.sitemap.default.title}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Favicon */}
      {siteConfig.icons.icon.map((icon) => (
        <link
          key={icon.sizes}
          rel="icon"
          type="image/png"
          sizes={icon.sizes}
          href={icon.url}
        />
      ))}
      <link rel="shortcut icon" href={siteConfig.icons.shortcut} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={`${siteConfig.url}${image}`} />
      <meta property="og:url" content={siteConfig.url} />
      <meta
        property="og:site_name"
        content={siteConfig.sitemap.default.title}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteConfig.handle} />
      <meta name="twitter:creator" content={siteConfig.handle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={`${siteConfig.url}${image}`} />

      {/* Additional Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={siteConfig.url} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta
        name="keywords"
        content={`${keywords}, real estate, listing, property`}
      />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.sitemap.default.title,
          description: siteConfig.sitemap.default.description,
          url: siteConfig.url,
          sameAs: [
            siteConfig.social.twitter,
            siteConfig.social.facebook,
            siteConfig.social.linkedin,
            siteConfig.social.youtube,
            siteConfig.social.instagram,
            siteConfig.social.telegram,
          ],
        })}
      </script>
    </Helmet>
  );
};
