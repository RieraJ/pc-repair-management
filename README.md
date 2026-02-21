# PC Repair Management

## ¿En qué consiste la aplicación?
Es una aplicación web diseñada para la **gestión de reparaciones de computadoras**. Permite a los técnicos y administradores llevar un registro organizado del estado de cada equipo ingresado al taller. 
A través de una interfaz interactiva tipo tablero Kanban, los usuarios pueden:
- Añadir nuevas computadoras al sistema de gestión.
- Cambiar el estado de la reparación (Recibido, En Progreso, Completado).
- Mantener un control claro del flujo de trabajo de las reparaciones.

## Tecnologías Utilizadas
La aplicación está construida utilizando un stack moderno, enfocado en el rendimiento y la experiencia de usuario:
- **Frontend**: [React](https://react.dev/) inicializado con [Vite](https://vitejs.dev/) para un desarrollo rápido.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) para un diseño responsivo y a medida.
- **Iconos**: [Lucide React](https://lucide.dev/) para la iconografía de la interfaz.
- **Backend y Base de Datos**: [Supabase](https://supabase.com/) como Backend-as-a-Service (BaaS) para la persistencia de datos y gestión en la nube.

## ¿Cómo se utiliza (Desarrollo Local)?

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. **Requisitos Previos**:
   - Tener [Node.js](https://nodejs.org/) instalado.
   - Contar con un proyecto configurado en Supabase con las tablas correspondientes.

2. **Instalación de Dependencias**:
   Abre una terminal, navega a la carpeta del frontend e instala los paquetes necesarios:
   ```bash
   cd frontend
   npm install
   ```

3. **Configuración de Variables de Entorno**:
   Crea un archivo llamado `.env` en la raíz de la carpeta `frontend` y añade tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu_anon_key_de_supabase
   ```

4. **Ejecución de la Aplicación**:
   Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en tu navegador, generalmente en `http://localhost:5173`.