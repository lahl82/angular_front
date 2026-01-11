# Angular Frontend

## Descripción
Frontend SPA desarrollado en Angular.
La misma aplicación web se utiliza en desktop y móvil (sin APK).

---

## Desarrollo con acceso desde LAN (desktop + móvil)

### Objetivo
- Probar la aplicación desde el teléfono real
- Validar diseño responsive en cada cambio
- Consumir la API Rails sin CORS

---

## Ejecución del frontend en LAN

El frontend se levanta usando el script definido en `package.json`.

Ejecutar:

    npm run start:lan

Esto ejecuta internamente:

    ng serve --host 0.0.0.0 --port 4200

Acceso desde navegador (PC o móvil):
- http://192.168.2.103:4200

---

## Comunicación con la API (Proxy Angular → Rails)

En desarrollo, el frontend consume la API Rails mediante un proxy,
evitando problemas de CORS.

Archivo: `src/proxy.conf.json`

    {
      "/services-api": {
        "target": "http://localhost:3001",
        "secure": false,
        "pathRewrite": {
          "^/services-api": ""
        }
      }
    }

Este proxy está configurado en `angular.json` bajo la sección `serve`.

---

## Regla fundamental de consumo de API

En el frontend **SIEMPRE** usar rutas relativas:

Correcto:
- /services-api/services.json

Incorrecto:
- http://localhost:3001/services.json

Usar `localhost` rompe el acceso desde el móvil, ya que el teléfono
no conoce el localhost de la PC.

---

## Soporte móvil

- Aplicación 100% web
- Probada desde navegador móvil real
- No existe APK

Requisito mínimo en `index.html`:

    <meta name="viewport" content="width=device-width, initial-scale=1">

---

## Docker (frontend productivo / referencia)

- Angular se compila en modo producción
- El build se sirve con Nginx
- Nginx hace proxy de `/services-api` hacia el backend

Archivo clave:
- `angular_front/nginx/nginx.conf`

Los archivos `httpd*.conf` corresponden a intentos antiguos con Apache
y no se utilizan actualmente.
