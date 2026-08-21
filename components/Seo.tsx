import Head from 'next/head';

const SITE_URL = 'https://laudtetteh.io';
const SITE_NAME = 'Laud Tetteh';
const DEFAULT_IMAGE_PATH = '/images/og/lt-og.png';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  type?: 'website' | 'article';
  imagePath?: string | null;
  imageAlt?: string;
}

function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export default function Seo({
  title,
  description,
  path = '/',
  type = 'website',
  imagePath = DEFAULT_IMAGE_PATH,
  imageAlt = 'Laud Tetteh initials logo',
}: SeoProps) {
  const url = absoluteUrl(path);
  const imageUrl = imagePath ? absoluteUrl(imagePath) : undefined;
  const twitterCard = imageUrl ? 'summary_large_image' : 'summary';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageUrl && <meta property="og:image:width" content="1200" />}
      {imageUrl && <meta property="og:image:height" content="630" />}
      {imageUrl && <meta property="og:image:alt" content={imageAlt} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageUrl && <meta name="twitter:image:alt" content={imageAlt} />}
    </Head>
  );
}
