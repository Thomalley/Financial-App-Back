# Primer acercamiento al template.

La preparación para comenzar a trabajar con el template de API se puede dividir en dos partes generales:
- configuración de la base de datos;
- configuración del template y variables de entorno.

Una vez que tenemos clonado el repositorio en nuestra pc, comenzaremos: 
## 1. **Cómo crear la base de datos**

   Dentro de la carpeta config está el archivo config, ahí se encuentra la configuración de la base de datos. En el .env se debe asignar las variables correspondientes a la base de datos (incluído el nombre con el que se creará/creó la bdd).
   - *Paso 1:*
   
     abrir la consola e iniciar como de costumbre.
   - *Paso 2:*
   
     ingresar el comando CREATE DATABASE nombreDeLaBDD; 
     
   Listo! ✅

#### *Si se usa un administrador de bdd, se debe crear la conexión con la bdd recién creada.*

   Con DBeaver: 
   - *Paso 1:*

   En la barra navegadora, arriba a la derecha, debajo de 'Archivo', hacer click en nueva conexión (ícono de un enchufe con un +), seleccionar PostgreSQL, dar click en siguiente.
   - *Paso2:*

   Ingresar el nombre de la base de datos (donde pone database), y más abajo el nombre de usuario y la contraseña de postgres (la misma de la configuración que se realiza cuando se descarga psql), dar click en finalizar.
  
Listo! ✅

## 2. **Crear las relaciones/asignaciones entre modelos**

   - *Paso 1:*

   Abrir VS, levantar la consola y correr npm run migrate.

Listo! ✅


## 3. **Empezar con el código...**

   - *Paso 1: configurar .env:*

   Asignarle '12345' a la variable SECRET_TOKEN_KEY en .env.
   
   Instalar extensión CODE runner en VS.
   
   Hablar con alguien del equipo para conseguir el AUTHORIZATION_TOKEN.  

   - *Paso 2: creación y verificación de usuario:*

     Instalar extensión REST client en VS.
     
     En controllers/auth/auth.routes.js comentar la función isAuthorized de la ruta /register. 
     
     En requests/auth/postRegister.rest completar los datos y correr la request con send request de la extensión REST client.
     
     Copiar el 'userTokenVerification' y pegarlo en la variable token de requests/auth/postVerifyUser.rest.
     
     Llenar el resto de datos y enviar la request para verificar el usuario.

   - *Paso 3: iniciar sesión:*
   
     Se puede hacer de dos maneras: desde el front (levantando todos los servidores de los dos repositporios) o desde la **request del back**:

       - En requests/auth/postLogin.rest ingresar email y contraseña del usuario que acabamos de verificar en el paso anterior y enviar la request.
Copiar el 'accessToken' y asignárselo a la variable TOKEN_X_USER en el .env.

   - *Paso 4:*
   
     En controllers/auth/auth.routes.js **descomentar** la función isAuthorized.


## En resumen...

El flujo de información sería: 

- Generar, utilizando el SECRET_TOKEN_KEY (frase que requiere JWT), el AUTHORIZATION_TOKEN, que es el token que le dice al backend *'hola soy el front y necesito cierta información'*. 

- Crear y verificar el usuario (se hace por única vez comentando la función isAuthorized para crear el primer usuario de la base de datos, luego ya no es necesario).

- Al iniciar sesión (la primera vez que se inicia sesión con un usuario, es necesario hacerlo desde el back para poder obtener el token y ponerlo en nuestro .env), se genera el TOKEN_X_USER, que es el que le dice al backend *'hola soy este determinado usuario'* para que se verifique si tiene autorización o no para acceder a la información que está requiriendo. Esto se hace para que no pueda venir cualquier usuario a buscar información que tal vez está reservada solo para administradores, por ejemplo. 

- Por último, se empieza a interactuar de manera directa con el código.

## Flujo de requests en backend:

- Llega la request desde el front que le pide información a una ruta (las rutas están en el archivo nombreFuncionalidad.routes.js, en la carpeta de controladores).

- Esa ruta llama a la *función isAuthorized*, para verificar que el usuario que está pidiendo la información desde el frontend sea un usuario autorizado; 
luego, llama a la *función de validación*, para validar que los parámetros que se están recibiendo sean el tipo de dato requerido y que no falte ninguno. 
Por último, si nada en ese camino falla, llama a la función que va a realizar la *interacción con la base de datos*.

