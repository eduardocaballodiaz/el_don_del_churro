// Layout común a todas las páginas de un idioma.
// Define <html lang>, las tipografías, los estilos globales, los textos del
// idioma, el encabezado y el enlace "Saltar al contenido".
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MotionProvider } from '@/animations/MotionProvider';
import { fuenteTexto, fuenteTitulos } from '@/styles/fonts';
import '@/styles/globals.css';

// Título y descripción por defecto (la Tarea 12 los afina página a página).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return { title: t('titulo'), description: t('descripcion') };
}

// Genera en la compilación una versión estática por idioma.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'header' });

  return (
    // suppressHydrationWarning: el script de abajo añade la clase "js" antes de React.
    <html
      lang={locale}
      className={`${fuenteTitulos.variable} ${fuenteTexto.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marca que hay JavaScript. El CSS solo oculta cosas para animarlas
            cuando existe esta clase, así sin JS todo el contenido se ve. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <a className="saltar" href="#contenido">
          {t('saltar')}
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            <Header />
            {children}
            <Footer />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
