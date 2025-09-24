# Guía de Despliegue en Netlify para Casa Sonia App

## ✅ Actualizaciones Completadas

### 1. Dependencias Actualizadas

- **SvelteKit**: Actualizado a v2.43.3
- **Svelte**: Actualizado a v5.39.5
- **Vite**: Actualizado a v6.3.6
- **TypeScript**: Actualizado a v5.9.2
- **Prisma**: Mantenido en v5.22.0 (compatible con Lucia Auth)
- **Lucia Auth**: Mantenido en v2.7.7 (estable)
- **Redis**: Actualizado a v5.8.2
- **Axios**: Actualizado a v1.12.2
- **Netlify Functions**: Actualizado a v4.2.6

### 2. Adaptador de Netlify

- ✅ Instalado `@sveltejs/adapter-netlify@5.2.3`
- ✅ Configurado en `svelte.config.js`
- ✅ Removido `@sveltejs/adapter-auto`

### 3. Archivos de Configuración Creados

- ✅ `netlify.toml` - Configuración de build y Node.js v18
- ✅ `_redirects` - Redirecciones para SPA
- ✅ `.nvmrc` - Especifica Node.js v18

### 4. Configuración CSRF Actualizada

- ✅ Migrado de `csrf: false` a `csrf: { checkOrigin: false }`

## 📋 Variables de Entorno Requeridas

En tu panel de Netlify, configura estas variables de entorno:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/basedatos
REDIS_URL=redis://host:puerto
LUCIA_SECRET=tu-clave-secreta-muy-segura
NODE_ENV=production
NETLIFY=true
```

## 🚀 Instrucciones de Despliegue

### Opción 1: Despliegue desde Git

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. El build se ejecutará automáticamente

### Opción 2: Despliegue Manual

1. Ejecuta `npm run build` localmente
2. Sube la carpeta `build/` a Netlify
3. Configura las variables de entorno

## ⚙️ Configuración de Build en Netlify

```
Build command: npm run build
Publish directory: build
Node.js version: 18
```

## 🔧 Servicios Externos Requeridos

### Base de Datos PostgreSQL

- Recomendado: [Supabase](https://supabase.com/) o [Railway](https://railway.app/)
- Actualiza `DATABASE_URL` con la conexión de tu servicio

### Redis

- Recomendado: [Upstash Redis](https://upstash.com/) (plan gratuito disponible)
- Actualiza `REDIS_URL` con la conexión de tu servicio

## 🛠️ Comandos Importantes

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Verificar tipos
npm run check

# Formatear código
npm run format
```

## ⚠️ Notas Importantes

1. **Prisma**: Después del despliegue, ejecuta las migraciones de la base de datos
2. **Redis**: Asegúrate de que el servicio Redis esté accesible desde Netlify
3. **Variables de Entorno**: Nunca expongas credenciales en el código fuente
4. **CSRF**: La configuración actual permite requests desde cualquier origen (solo para desarrollo)

## 🔍 Troubleshooting

### Error de Build

- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Netlify

### Error de Base de Datos

- Confirma que `DATABASE_URL` sea correcta
- Verifica que las migraciones de Prisma estén aplicadas

### Error de Redis

- Confirma que `REDIS_URL` sea correcta
- Verifica que el servicio Redis esté activo

## 📚 Recursos Adicionales

- [Documentación de SvelteKit](https://kit.svelte.dev/)
- [Documentación de Netlify](https://docs.netlify.com/)
- [Guía de Prisma](https://www.prisma.io/docs/)
- [Documentación de Lucia Auth](https://lucia-auth.com/)

¡Tu aplicación está lista para ser desplegada en Netlify! 🎉
