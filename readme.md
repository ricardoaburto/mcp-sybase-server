# @mcp-sybase-server-dev

Este proyecto proporciona un servidor compatible con el **Model Context Protocol (MCP)**, diseñado para interactuar con una base de datos Sybase. Actúa como un puente entre un cliente compatible con MCP (como un asistente de IA) y tu base de datos, permitiendo ejecutar consultas y explorar el esquema de la base de datos de forma remota.

El servidor está construido con Node.js y utiliza un conector Java (JDBC) para establecer la comunicación con Sybase.

## Características

- Conexión segura a una base de datos Sybase.
- Listado de todas las tablas disponibles.
- Descripción del esquema de una tabla específica.
- Ejecución de consultas SQL de solo lectura (`SELECT`).
- Soporte para despliegue en contenedores con Docker.

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado lo siguiente en tu sistema:

- **Node.js** (se recomienda v18 o superior)
- **npm** (normalmente se instala con Node.js)
- **Java Development Kit (JDK)** (se recomienda JDK 11 o superior)
- **Docker** (Opcional, solo si deseas usar el despliegue en contenedores)

## Instalación

1.  **Clona el repositorio** (o descarga los archivos en un directorio):
    ```bash
    # Ejemplo si estuviera en un repositorio git
    # git clone https://github.com/mcp-sybase-server-dev.git
    # cd sybase-server
    ```

2.  **Instala las dependencias y compila el proyecto**:
    Navega al directorio raíz del proyecto y ejecuta el siguiente comando. Este comando instalará los paquetes de Node.js necesarios y ejecutará automáticamente los scripts para compilar tanto el código Java como el de TypeScript.
    ```bash
    npm install
    ```
    Al finalizar, deberías tener una nueva carpeta `dist` con el código JavaScript listo para ser ejecutado.

## Uso

### Ejecutar el Servidor

Para iniciar el servidor, ejecuta el siguiente comando desde el directorio raíz del proyecto, proporcionando los detalles de tu conexión a Sybase en una cadena JSON.

```bash
node dist/src/index.js "{\"host\":\"tu_host\",\"port\":tu_puerto,\"database\":\"tu_db\",\"user\":\"tu_usuario\",\"password\":\"tu_contraseña\"}"
```

**Importante:**
- Reemplaza los valores de `tu_host`, `tu_puerto`, etc., con tus credenciales reales.
- Toda la cadena de conexión JSON debe estar envuelta en comillas dobles (`"`) para que la terminal la interprete como un solo argumento.

Si el servidor se inicia correctamente, la terminal se quedará en espera de conexiones. No mostrará ningún mensaje adicional a menos que ocurra un error.

### Herramientas Disponibles

Una vez que el servidor está en funcionamiento y conectado a un cliente MCP, puedes usar las siguientes herramientas (generalmente a través de lenguaje natural):

#### `list_tables`
Enumera todas las tablas de usuario en la base de datos.
- **Ejemplo de instrucción:** `"¿Qué tablas hay en la base de datos?"`

#### `describe_table`
 Muestra las columnas y tipos de datos para una tabla específica.
- **Parámetros:** `table_name` (string)
- **Ejemplo de instrucción:** `"Describe el esquema de la tabla 'sysusers'"`

#### `query`
Ejecuta una consulta `SELECT` y devuelve los resultados en formato JSON.
- **Parámetros:** `sql` (string)
- **Ejemplo de instrucción:** `"Ejecuta la consulta 'SELECT * FROM sysusers WHERE uid < 10'"`

## Despliegue con Docker (Opcional)

El proyecto incluye un `Dockerfile` para facilitar el despliegue en contenedores.

1.  **Construir la imagen de Docker:**
    Desde el directorio raíz del proyecto, ejecuta el script de construcción:
    ```bash
    # Para Windows (si usas Git Bash o WSL)
    sh build.sh
    
    # O directamente con Docker
    docker build -t mcp-sybase-server-dev .
    ```

2.  **Ejecutar el contenedor:**
    Usa el siguiente comando para iniciar el servidor dentro de un contenedor Docker. El flag `-i` es crucial para mantener la entrada estándar abierta y permitir que el servidor reciba peticiones.
    ```bash
    docker run -i --rm mcp-sybase-server-dev "{\"host\":\"tu_host\",\"port\":tu_puerto,\"database\":\"tu_db\",\"user\":\"tu_usuario\",\"password\":\"tu_contraseña\"}"
    ```

## Licencia

Este proyecto está bajo la Licencia MIT.