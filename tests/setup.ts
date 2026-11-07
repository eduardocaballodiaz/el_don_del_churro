// Se ejecuta antes de cada archivo de pruebas.
// Añade comprobaciones como toBeInTheDocument() y limpia el DOM entre pruebas.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
