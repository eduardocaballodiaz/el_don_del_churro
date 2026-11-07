// GSAP con ScrollTrigger, registrado una sola vez para toda la web.
// Importar SIEMPRE desde aquí: import { gsap, ScrollTrigger } from '@/animations/gsap';
'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };
