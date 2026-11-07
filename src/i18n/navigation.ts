// Enlaces y navegación que conocen el idioma actual.
// Usar SIEMPRE estos en lugar de los de 'next/link' y 'next/navigation':
// así un <Link href="/carta"> lleva a /carta en español y a /en/menu en inglés.
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
