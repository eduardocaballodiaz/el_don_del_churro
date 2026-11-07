// Comprueba si la web está lista para publicarse en eldondelchurro.com.
// Uso: npm run comprobar-lanzamiento
// Sale con código 1 (error) si falta algún dato, para que nadie publique por despiste.
import { datosPendientes } from '../src/content/pendientes';

const pendientes = datosPendientes();

if (pendientes.length === 0) {
  console.log('✅ Todo listo: no falta ningún dato para publicar.');
} else {
  console.log('⛔ Todavía no se puede publicar. Falta:');
  for (const p of pendientes) console.log(`   • ${p}`);
  process.exitCode = 1;
}
