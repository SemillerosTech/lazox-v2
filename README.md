# LAZOX

Sitio web de LAZOX: experiencias, libros y talleres para crecer juntos.

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- [lucide-react](https://lucide.dev) para iconografía
- pnpm como gestor de paquetes

## Requisitos

- Node.js >= 20.9
- pnpm 11 (`corepack enable` o `npm i -g pnpm`)

## Desarrollo

```sh
pnpm install
pnpm dev
```

El sitio queda disponible en http://localhost:3000.

## Scripts

| Script           | Descripción                  |
| ---------------- | ---------------------------- |
| `pnpm dev`       | Servidor de desarrollo       |
| `pnpm build`     | Build de producción          |
| `pnpm start`     | Sirve el build de producción |
| `pnpm lint`      | ESLint                       |
| `pnpm typecheck` | Verificación de tipos        |
| `pnpm format`    | Formatea con Prettier        |

## Estructura

```
app/
  layout.tsx        Layout raíz, metadata y fuentes
  page.tsx          Landing principal
  globals.css       Tailwind + design system de marca
  icon.svg          Favicon
  not-found.tsx     404
  error.tsx         Error boundary
components/
  site-header.tsx   Header con menú móvil (client component)
  logo.tsx          Logo oficial
  newsletter-form.tsx
public/
  images/           Ilustraciones del sitio
  logo.svg          Logo oficial
```

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Configura **Root Directory** en `lazox-v2`.
3. Vercel detecta Next.js y usa `pnpm install` / `pnpm build` automáticamente.

No se requieren variables de entorno ni configuración adicional.
