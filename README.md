# Dev Journal

**Dev Journal** es una aplicación de escritorio para desarrolladores que te ayuda a registrar y dar seguimiento a tus actividades de trabajo. Mediante recordatorios periódicos, te pregunta en qué estás trabajando, mantiene un historial de tus entradas y te permite consultar reportes de productividad.

## Tecnologías

- [Electron](https://www.electronjs.org/) — aplicación de escritorio multiplataforma
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — interfaz de usuario
- [SQLite](https://www.sqlite.org/) (via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)) — base de datos local
- [Tailwind CSS](https://tailwindcss.com/) — estilos

## Características

- Ícono en la bandeja del sistema (tray) para acceso rápido
- Recordatorios automáticos (cron) que preguntan qué actividad estás realizando
- Posibilidad de posponer (snooze) el recordatorio o continuar con la tarea actual
- Historial de actividades con reportes por período
- Configuración de horario de trabajo y tiempos de descanso
- Disponible para **Linux** (AppImage) y **Windows** (instalador NSIS / portable)

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/efrenrodas/dev-journal.git
cd dev-journal

# 2. Instala las dependencias
npm install
```

## Uso en desarrollo

```bash
npm run dev
```

Esto levanta el servidor de desarrollo de Vite y abre la ventana de Electron automáticamente.

## Compilar para producción

### Linux (AppImage)

```bash
npm run dist
```

### Windows (instalador NSIS + portable)

```bash
npm run dist:win
```

Los archivos generados se encuentran en la carpeta `release/`.

## Ejecutar la versión compilada

```bash
npm run build   # compila el frontend
npm start       # abre Electron con los archivos compilados
```

## Lint

```bash
npm run lint
```
