// Layout común a todas las páginas de un idioma.
// Define <html lang>, las tipografías, los estilos globales, los textos del
// idioma, el encabezado y el enlace "Saltar al contenido".
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { DOMINIO } from '@/lib/seo/urls';
import { leerRotuloSvg } from '@/lib/rotulo';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MotionProvider } from '@/animations/MotionProvider';
import { CustomCursor } from '@/animations/CustomCursor';
import { fuenteTexto, fuenteTitulos } from '@/styles/fonts';
import '@/styles/globals.css';

// Valores por defecto (por ejemplo, para el 404). Cada página define los suyos con construirMetadata.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  return { metadataBase: new URL(DOMINIO), title: t('titulo'), description: t('descripcion') };
}

const SCRIPT_JS = `(function(){var h=document.documentElement;h.classList.add('js');setTimeout(function(){if(!h.classList.contains('hidratado'))h.classList.remove('js')},4000)})()`;

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
            cuando existe esta clase, así sin JS todo el contenido se ve.
            Red de seguridad: si en 4 s la web no ha arrancado (un script no cargó,
            red inestable…), se quita la clase y todo el contenido se muestra. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_JS }} />
      </head>
      <body>
        <a className="saltar" href="#contenido">
          {t('saltar')}
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            <Header rotuloSvg={leerRotuloSvg()} />
            {children}
            <Footer />
            <CustomCursor />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
