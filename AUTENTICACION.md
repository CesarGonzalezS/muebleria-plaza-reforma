# Sistema de Autenticación

## Descripción

Se ha implementado un sistema completo de autenticación basado en las APIs especificadas. El sistema incluye:

### Archivos Creados

1. **src/services/auth.js** - Servicio de autenticación
   - Maneja todas las operaciones de autenticación
   - Gestiona tokens en localStorage
   - Método para verificar si el usuario está autenticado

2. **src/views/RegisterView.vue** - Pantalla de Registro
   - Formulario simple para registrar nuevos clientes
   - Validación de contraseñas
   - Redirección automática a login después del registro

3. **src/views/LoginView.vue** - Pantalla de Login (ACTUALIZADA)
   - Actualizada para usar el nuevo servicio de autenticación
   - Ahora redirige a /admin después del login
   - Link para ir a la pantalla de registro

### Archivos Modificados

1. **src/router/index.js**
   - Agregada ruta para `/register`
   - Actualizado el interceptor para usar `accessToken` en lugar de `token`

2. **src/config/AxiosConfig.js**
   - Actualizado para usar `accessToken` como respaldo
   - Interceptor de respuesta mejorado para limpiar todos los tokens

3. **src/components/Navbar.vue**
   - Agregado botón de Logout cuando el usuario está autenticado
   - Agregado botón de Login cuando no está autenticado
   - Lógica de cierre de sesión integrada

## URLs de las Pantallas

- **Registro**: `/register`
- **Login**: `/login`

## API Endpoints

El sistema implementa las siguientes APIs:

1. **POST /api/auth/register** - Registrar nuevo cliente
   ```json
   {
     "name": "Juan Pérez",
     "email": "juan@example.com",
     "password": "SecurePass123!",
     "phone": "+52 5555551234"
   }
   ```

2. **POST /api/auth/login** - Iniciar sesión
   ```json
   {
     "email": "juan@example.com",
     "password": "SecurePass123!"
   }
   ```

3. **POST /api/auth/refresh** - Refrescar token
   ```
   Query param: refreshToken
   ```

4. **POST /api/auth/logout** - Cerrar sesión
   ```
   Query params: accessToken (opcional), refreshToken (opcional)
   ```

## Flujo de Autenticación

1. **Registro**: 
   - Usuario llena el formulario en `/register`
   - Se envía POST a `/api/auth/register`
   - Se redirige automáticamente a `/login` tras el éxito

2. **Login**:
   - Usuario ingresa credenciales en `/login`
   - Se envía POST a `/api/auth/login`
   - Se guardan `accessToken` y `refreshToken` en localStorage
   - Se redirige a `/admin`

3. **Protección de rutas**:
   - Las rutas que requieren autenticación verifican si existe `accessToken`
   - Si no existe, redirigen a `/login`

4. **Logout**:
   - El botón en la Navbar llama a `/api/auth/logout`
   - Se limpian todos los tokens
   - Se redirige a `/login`

## Estilos

Las pantallas tienen estilos básicos implementados. Puedes personalizarlos modificando:
- `src/views/RegisterView.vue` - Estilos del formulario de registro
- `src/views/LoginView.vue` - Estilos del formulario de login

## Próximos Pasos

1. Personalizar los estilos según tu diseño
2. Implementar la API en el backend si aún no existe
3. Ajustar la URL de la API en las variables de entorno (VITE_API_URL)
4. Agregar lógica de "recordar contraseña" si es necesario

