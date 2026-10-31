# El Don del Churro

Web de la churrería y cafetería de Calle Correduría 42, Sevilla. HTML, CSS y JavaScript, sin dependencias de ejecución ni seguimiento propio. Imágenes y fuentes servidas localmente.

## Desarrollo

Node.js 22 o posterior. Desde este directorio:

```sh
npm start
```

Puerto 3000; configurable con PORT. No hace falta instalar paquetes. Los archivos públicos son index.html, styles.css, app.js, product-images.js, accordions.js y assets/. Se pueden alojar como web estática con HTTPS. server.mjs es un servidor de desarrollo.

## Contenido confirmado

- Churros finos y de rueda: ración 3 €, con café 4,50 €, con chocolate 5,50 €.
- El Don de Latas: postres por capas en latas transparentes, 5 €.
- Correduría tiene más presencia visual que el número 42.
- Próxima apertura, sin fecha ni horarios confirmados.
- Sin pedidos ni reservas. El formulario es de contacto, no de registro ni mailing.
- No se muestran cantidades de churros en los textos públicos.

## Interacciones

- Cada tarjeta incluye en el HTML sus dos fotografías (data-product-kind=fine/wheel). product-images.js alterna hidden de forma síncrona: elegir rueda nunca depende de que carguen las tres imágenes a la vez ni vuelve a mostrar finos si una foto falla. Las fotos se preparan con prioridad baja antes de llegar al selector y usan variantes responsivas 480/960. Cada imagen tiene su estado y reintento; se conserva la caché al alternar. La galería devuelve el foco al cerrarse.
- Las secciones aparecen al bajar y se retiran al subir al cruzar el umbral de entrada; el contenido con foco permanece visible. Se respeta prefers-reduced-motion, incluso al cambiarlo en vivo.
- accordions.js anima la altura de los detalles tanto al abrir como al cerrar. Admite clics rápidos, teclado, foco, enlaces a privacidad, resize y movimiento reducido. Sin JS los detalles conservan su funcionamiento nativo.
- La navegación principal usa enlaces de 17–20 px, peso 600 y áreas de pulsación de al menos 48 px. En móvil y tablet se coloca debajo del logo centrado. El subrayado se expande desde su centro. Al pasar el cursor o recibir foco, el logo circular crece un 12 % y se ilumina por detrás con un halo amarillo cálido; con movimiento reducido conserva la luz sin ampliar ni animar.
- Instagram: [@eldondelchurro](https://www.instagram.com/eldondelchurro/), accesible desde la cabecera y el pie, con icono vectorial local y sin widgets externos. TikTok y Facebook quedan pendientes de confirmar sus perfiles.
- La corona activa es la del logotipo que aportó el usuario: dorado con volumen, reflejos, tres remates redondos y contorno negro. No sustituirla por las variantes planas u ornamentales anteriores. Versiones web activas: assets/crown-logo-128.webp y crown-logo-320.webp; fuente PNG: assets/crown-logo.png. Las otras variantes conservadas en assets son históricas y no se usan en el HTML.

## Mapa integrado directamente

El iframe de Google Maps tiene src desde el HTML, sin botón ni interacción previa. La carga diferida del navegador comienza automáticamente al acercarse a la sección. Busca Calle Correduría 42, Sevilla. El enlace de indicaciones está siempre disponible y no cubre la atribución del mapa.

La red activa del entorno sigue sin permitir www.google.com. Comprobación real sin respuestas simuladas: proxy CONNECT 403 Envoy; Chromium net::ERR_TUNNEL_CONNECTION_FAILED y página de error dentro del iframe. Se verificó el tamaño correcto del contenedor, pero no hay respuesta de Google ni pin real validado. El permiso ya está guardado en el borrador: aplicar www.google.com desde los ajustes de red y guardar/publicar la configuración del entorno, después volver a comprobar la carga y observar si algún recurso secundario necesita permiso. El aviso y el enlace externos están disponibles si no aparece el mapa. No presentar una captura PNG como mapa interactivo.

## Formulario de contacto

#contacto recoge nombre, correo, asunto, mensaje y aceptación de la información de privacidad. Hace un POST HTML nativo a https://formsubmit.co/eldondelchurro@gmail.com. No crea cuentas, no registra suscriptores ni envía campañas. El negocio recibe consultas para responder por correo. El enlace mailto visible ofrece contacto directo.

Se validan campos obligatorios, formato de correo y longitudes, además de rechazar campos compuestos solo de espacios. Hay un campo trampa _honey. La web explica el servicio utilizado y continúa en la página de FormSubmit; no muestra una confirmación de entrega inventada.

Pendiente para producción: activar el destinatario mediante el correo de confirmación del proveedor en el primer envío real y comprobar la entrega a Gmail desde el dominio publicado. Un primer envío no debe darse por conservado hasta verificarlo; repetirlo tras activar si el proveedor lo requiere. formsubmit.co continúa bloqueado por la política de red actual, aunque el permiso está guardado en el borrador. Las pruebas interceptan el POST: no envían mensajes ni datos reales al proveedor. No se necesita ni debe incorporarse una contraseña de Gmail al proyecto.

## Validación

Comprobados ocho anchos entre 320 y 1440 px, contenido sin desbordar, selector con red lenta/fallos/timeouts, 20 cambios en escritorio y 20 taps móviles, reintentos de carga inicial y galería, animación y reversión de acordeones, teclado, movimiento reducido, logo y subrayado. Formulario validado con envío interceptado y campos de contacto completos. Los servicios remotos de Google Maps y FormSubmit siguen pendientes de verificación real.

## Recursos y publicación

Las imágenes de producto son presentaciones generadas con IA y están identificadas como tales; sustituirlas por fotografías reales cuando estén disponibles. Originales conservados en /workspace/generated_images. Assets usa WebP optimizado. Cormorant Garamond y DM Sans proceden del repositorio oficial google/fonts, bajo SIL OFL 1.1, con licencias en assets/fonts.

Antes de publicar, confirmar datos legales del negocio, alérgenos, fecha/horarios y combinaciones de postres; verificar correo y mapa; configurar dominio y HTTPS. La ejecución del servidor de desarrollo no publica la web.

## Corrección de las fotos de rueda (v2)

Fallo anterior reproducido en el ZIP: al abortar solo wheel-coffee-960.webp, Promise.all rechazaba el lote completo y las tres fotos seguían siendo finos, aunque las otras dos fotos de rueda hubieran cargado. Ese mecanismo se ha eliminado. Ahora la selección cambia inmediatamente y cada fotografía de rueda carga y falla por separado. Una imagen fallida muestra su aviso y botón de reintento, sin impedir ver las demás.

La revisión se identifica con product-images.js?v=20261030-rueda2 y styles.css?v=20261030-rueda2 para evitar mantener el cargador antiguo en caché. Al actualizar una instalación, reemplazar la carpeta completa por el nuevo ZIP, incluidos index.html, scripts y assets.

## Permisos al publicar en Hostalia

publicar-web.zip fija archivos a 0644 y carpetas a 0755. No volver a usar un ZIP que conserve 0600: puede causar un HTTP 403 en Hostalia/Plesk. Comprobar index.html y todos los recursos extraídos.

## Revisión de contenido y fotografía de las latas

La portada organiza el contenido en carta, postres, ubicación y contacto. Se han retirado el bloque genérico sobre el local, el cierre promocional y preguntas que repetían la carta. Los precios, la apertura pendiente, el aviso de imágenes generadas y la privacidad se mantienen. La tapa de la lata delantera se ha corregido para corresponder al diámetro de la abertura; las dos variantes WebP y la galería usan la versión `20261031-tapa2`.
