# 🔐 Configuración de AWS Systems Manager Parameter Store

## Descripción

Tu aplicación ahora obtiene las credenciales de MongoDB desde **AWS Systems Manager Parameter Store** en lugar de variables de entorno locales.

## Variable Configurada

- **Variable en serverless.yml**: `MONGO_URI`
- **Parámetro SSM**: `/tienda/prod/mongo_uri`
- **Región**: us-east-1 (configurable en serverless.yml)

## ¿Cómo Configurar?

### Opción 1: Usando AWS CLI

```bash
# Crear el parámetro en AWS Systems Manager Parameter Store
aws ssm put-parameter \
  --name "/tienda/prod/mongo_uri" \
  --value "mongodb+srv://USER:PASSWORD@cluster.mongodb.net/tienda?retryWrites=true&w=majority" \
  --type "SecureString" \
  --region us-east-1
```

### Opción 2: Usando AWS Console

1. Accede a **AWS Systems Manager** → **Parameter Store**
2. Click en **"Create parameter"**
3. Completa con:
   - **Name**: `/tienda/prod/mongo_uri`
   - **Type**: `SecureString`
   - **Value**: Tu cadena de conexión MongoDB (ej: `mongodb+srv://user:pass@cluster.mongodb.net/tienda`)
   - **Tags** (opcional): Para organizar tus parámetros

4. Click en **"Create parameter"**

## Cadena de Conexión MongoDB

Ejemplo con MongoDB Atlas:
```
mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/tienda?retryWrites=true&w=majority
```

Partes:
- `usuario`: Tu usuario de MongoDB Atlas
- `contraseña`: Tu contraseña (URL encoded si tiene caracteres especiales)
- `cluster0.xxxxx.mongodb.net`: Tu endpoint de MongoDB Atlas
- `tienda`: Nombre de tu base de datos

## Permisos IAM Requeridos

La aplicación necesita estos permisos (ya configurados en `serverless.yml`):

```yaml
- Effect: Allow
  Action:
    - ssm:GetParameter
    - ssm:GetParameters
  Resource: 
    - "arn:aws:ssm:${aws:region}:${aws:accountId}:parameter/tienda/*"
```

## Verificar Configuración

### En Local (pruebas antes de desplegar)

Para simular AWS localmente, usa **serverless-offline**:

```bash
# 1. Instalar serverless-offline
npm install --save-dev serverless-offline

# 2. Agregar plugin a serverless.yml (opcional)
plugins:
  - serverless-offline

# 3. Ejecutar sin parámetro SSM (usa .env)
npm run offline
```

**Nota**: En desarrollo local, puedes seguir usando `.env` y la aplicación usará `process.env.MONGO_URI`. Para usar SSM localmente, necesitarías un simulador de AWS.

### En Producción (AWS Lambda)

Las Lambda accederán automáticamente al parámetro SSM cuando se desplieguen.

## Monitorar Cambios

Para actualizar la conexión sin redeplegar:

```bash
# Actualizar el parámetro
aws ssm put-parameter \
  --name "/tienda/prod/mongo_uri" \
  --value "nueva_cadena_conexion" \
  --type "SecureString" \
  --overwrite \
  --region us-east-1
```

Las nuevas instancias de Lambda usarán automáticamente la nueva configuración.

## Solución de Problemas

### Error: "Parameter /tienda/prod/mongo_uri not found"

**Solución**: El parámetro no existe en AWS Systems Manager. Crea el parámetro siguiendo los pasos arriba.

### Error: "User: arn:aws:iam::... is not authorized to perform: ssm:GetParameter"

**Solución**: La rol IAM de Lambda no tiene permisos. Verifica que `serverless.yml` tenga la sección `iamRoleStatements` correctamente configurada.

### Conexión lenta desde Lambda

**Solución**: Verifica que:
- Tu cluster MongoDB está accesible desde Internet
- Las IP de AWS Lambda están en whitelist de MongoDB Atlas
- La VPC de Lambda tiene acceso a Internet (si es necesario)

## Archivos Modificados

- ✅ `serverless.yml` - Añadido `MONGO_URI` y permisos IAM
- ✅ `index.js` - Usa `process.env.MONGO_URI`
- ✅ `src/lambda/*.js` - Todas las funciones usan `process.env.MONGO_URI`

## Próximos Pasos

1. ✅ Crear el parámetro en AWS Systems Manager
2. ✅ Verificar que tu rol IAM tenga permisos
3. ✅ Desplegar con `serverless deploy`
4. ✅ Probar tus endpoints
