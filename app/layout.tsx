import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { LanguageProvider } from '@/components/LanguageContext';
import AIChat from '@/components/AIChat';

export const metadata: Metadata = {
  title: 'Darul Uloom Siddiqia | Rooted in Deen, Rising with Knowledge',
  description:
    'Official portal and administration of Darul Uloom Siddiqia, Aurahi East, Simraha, Araria, Bihar, India. Under the leadership of Nazim Maulana Abdus Subhan. Dedicated to classical Islamic scholarship, Hifz-ul-Quran, and humanitarian welfare.',
  keywords: [
    'Darul Uloom Siddiqia',
    'Darul Uloom Siddiqia Aurahi',
    'Darul Uloom Siddiqia Aurahi East',
    'Darul Uloom Siddiqia Aurahi West',
    'Darul Uloom Siddiqia Simraha',
    'Darul Uloom Siddiqia Araria',
    'Darul Uloom Siddiqia Bihar',
    'Darul Uloom Siddiqia India',
    'Darul Uloom Siddiqia Abdus Subhan',
    'Maulana Abdus Subhan',
    'Nazim Darul Uloom Siddiqia',
  ],
  authors: [{ name: 'Darul Uloom Siddiqia' }],
  openGraph: {
    title: 'Darul Uloom Siddiqia | Rooted in Deen, Rising with Knowledge',
    description:
      'Official portal of Darul Uloom Siddiqia, Aurahi East, Simraha, Araria, Bihar, India. Nurturing authentic Islamic scholarship, Quranic preservation, and prophetic character.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Darul Uloom Siddiqia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darul Uloom Siddiqia | Rooted in Deen, Rising with Knowledge',
    description:
      'Official portal of Darul Uloom Siddiqia, Aurahi East, Simraha, Araria, Bihar, India. Led by Nazim Maulana Abdus Subhan.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Darul Uloom Siddiqia',
  alternateName: ['دار العلوم الصديقية', 'दारुल उलूम सिद्दीकिया'],
  description:
    'Distinguished center of classical Islamic sciences, Quranic preservation, and ethical education in Aurahi East, Simraha, Araria, Bihar, India.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Village Aurahi East, PO Simraha',
    addressLocality: 'Araria',
    addressRegion: 'Bihar',
    postalCode: '854318',
    addressCountry: 'India',
  },
  telephone: '+91 8828290721',
  founder: {
    '@type': 'Person',
    name: 'Maulana Abdus Subhan',
    jobTitle: 'Nazim',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-stone-800 bg-[#faf8f5] selection:bg-amber-200 selection:text-stone-900 min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <AIChat />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
