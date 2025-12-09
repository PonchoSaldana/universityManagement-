# Backend Escuela

Este es el backend para la aplicación de la escuela.

## Requisitos

- Node.js
- MySQL (Laragon recomendado)

## Configuración

1. Asegúrate de que MySQL esté corriendo en el puerto 3306.
2. Crea una base de datos llamada `escuela_db` o ejecuta el script de configuración.
3. Configura las variables de entorno en `.env` si tus credenciales son diferentes a las predeterminadas (root/vacío).

## Scripts

- `npm run dev`: Inicia el servidor en modo desarrollo (con nodemon).
- `node setup_db.js`: Crea la base de datos y las tablas (requiere que MySQL esté corriendo).

## Endpoints

- `GET /`: Verifica que la API está funcionando.
- `GET /test-db`: Verifica la conexión a la base de datos.
