# Solución del Error CORS

## El Problema
```
Access to XMLHttpRequest at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:5174' 
has been blocked by CORS policy: Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Causa
Tu backend en `http://localhost:8080` **NO está configurado para aceptar peticiones desde `http://localhost:5174`** (o desde cualquier origen).

## Soluciones

### OPCIÓN 1: Configuración CORS en el Backend Spring Boot (RECOMENDADO)

Si tu backend es **Spring Boot**, añade esta configuración:

#### Opción 1A: Usando @CrossOrigin (Simple)
```java
@RestController
@CrossOrigin(origins = "http://localhost:5174", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/api/auth")
public class AuthController {
    // ... tus métodos
}
```

#### Opción 1B: Configuración Global (Mejor)
Crea una clase `WebConfig.java`:

```java
package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5174", "http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

#### Opción 1C: Usando Spring Security (Si lo usas)
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(Arrays.asList("http://localhost:5174", "http://localhost:5173"));
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(Arrays.asList("*"));
            config.setAllowCredentials(true);
            config.setMaxAge(3600L);
            return config;
        }));
        // ... resto de tu configuración
        return http.build();
    }
}
```

### OPCIÓN 2: Usando application.properties/yml

```properties
# application.properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS Configuration
server.cors.allow-credentials=true
server.cors.allowed-headers=*
server.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
server.cors.allowed-origins=http://localhost:5174,http://localhost:5173
server.cors.max-age=3600
```

### OPCIÓN 3: Usando Nginx/Proxy (Para Producción)

En el archivo de configuración de Nginx:
```nginx
add_header Access-Control-Allow-Origin "http://tudominio.com" always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
```

---

## En Frontend (YA ESTÁ HECHO)

✅ Tu `vite.config.js` ya tiene configurado el proxy
✅ Tu `AxiosConfig.js` tiene la URL correcta: `http://localhost:8080`
✅ Los headers de CORS en las peticiones están configurados

---

## Pasos para Aplicar la Solución

### Si usas Spring Boot (Recomendado):

1. **Abre tu proyecto backend**
2. **Crea el archivo** `src/main/java/com/example/config/WebConfig.java`
3. **Copia el código de la Opción 1B arriba**
4. **Reinicia tu backend**
5. **Prueba nuevamente en el frontend**

### Si tu backend usa otra tecnología:

Busca cómo configurar CORS en tu framework:
- **Node.js/Express**: Instala `npm install cors` y úsalo
- **Python/Flask**: Instala `flask-cors`
- **PHP**: Añade headers manualmente
- **Django**: Instala `django-cors-headers`

---

## Verificación

Una vez configurado, tu backend debería responder con estos headers:

```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

Para verificar en el navegador:
1. Abre **DevTools** (F12)
2. Ve a la pestaña **Network**
3. Haz un login
4. Busca la petición a `/api/auth/login`
5. En **Response Headers** deberías ver `Access-Control-Allow-Origin: http://localhost:5174`

---

## Contacto

Si después de aplicar esto sigue dando error, comparte:
- ¿Qué framework usa tu backend?
- El error exacto que ves en la consola

