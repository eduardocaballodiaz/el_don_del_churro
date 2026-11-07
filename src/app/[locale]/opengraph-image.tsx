// IMAGEN PARA COMPARTIR (Open Graph, 1200×630): la que se ve al enviar el enlace
// por WhatsApp, Instagram, Facebook o X. Se genera al compilar, una por idioma.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { negocio } from '@/content/negocio';

export const alt = 'El Don del Churro';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ImagenCompartir({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  const rotulo = await readFile(join(process.cwd(), 'public/logo/rotulo.svg'), 'utf8');
  const rotuloDataUri = `data:image/svg+xml;base64,${Buffer.from(rotulo).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 28,
          background: 'radial-gradient(circle at 50% 40%, #56603a 0%, #3C4229 45%, #23281A 100%)',
          color: '#FFF3D6',
          borderBottom: '8px solid #FFC24D',
        }}
      >
        <img src={rotuloDataUri} width={640} height={270} alt="" />
        <div style={{ fontSize: 40, color: '#FFF3D6' }}>{t('og.lema')}</div>
        <div style={{ fontSize: 26, color: '#D4A448', letterSpacing: 6 }}>
          {`${negocio.direccion.calle.toUpperCase()} · ${negocio.direccion.ciudad.toUpperCase()}`}
        </div>
      </div>
    ),
    size,
  );
}
