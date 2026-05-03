# Guía de Despliegue en AWS Lambda (Capa Gratuita)

## Requisitos
1. Cuenta AWS activa (capa gratuita)
2. AWS CLI instalado y configurado
3. MongoDB Atlas o instancia MongoDB accesible
4. Node.js 18.x

## Paso 1: Configurar AWS CLI

```bash
# Instalar AWS CLI (si no lo tienes)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciales
aws configure
# Ingresar:
# - AWS Access Key ID: [tu access key]
# - AWS Secret Access Key: [tu secret key]
# - Default region: us-east-1 (recomendado para capa gratuita)
# - Default output format: json
```

**¿Dónde obtener tus credenciales?**
1. Accede a [AWS Console](https://console.aws.amazon.com)
2. Ve a IAM → Users → Selecciona tu usuario
3. Crea una nueva Access Key en la pestaña "Security credentials"

⚠️ **IMPORTANTE**: Guarda tus credenciales en lugar seguro. No las compartas.

## Paso 2: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cat > .env << EOF
MONGODB=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tienda?retryWrites=true&w=majority
SECRET_KEY=tu_jwt_secret_key_aqui
FRONTEND_URL=https://tu-frontend.com
EOF
```

**Notas:**
- Si usas MongoDB Atlas (gratis), copia tu connection string
- `SECRET_KEY` debe ser una cadena larga y segura
- `FRONTEND_URL` es la URL de tu frontend (necesaria para confirmación de email)

## Paso 3: Actualizar serverless.yml con Secrets

⚠️ **NO hagas commit de `.env`**. Las variables se pasarán en el despliegue:

```yaml
service: tienda-be-lambda

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    MONGODB: ${env:MONGODB}
    SECRET_KEY: ${env:SECRET_KEY}
    FRONTEND_URL: ${env:FRONTEND_URL}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - logs:CreateLogGroup
        - logs:CreateLogStream
        - logs:PutLogEvents
      Resource: "*"
```

## Paso 4: Validar Configuración Localmente

```bash
# 1. Instalar dependencias (si no las tienes)
npm install

# 2. Probar localmente
npm run offline

# 3. En otra terminal, probar un endpoint
curl -X GET http://localhost:3000/dev/producto
```

Si funciona localmente, continúa al despliegue.

## Paso 5: Desplegar en AWS

```bash
# Opción 1: Desplegar en stage 'dev' (recomendado para pruebas)
npm run deploy -- --stage dev

# Opción 2: Desplegar en stage 'prod' (para producción)
npm run deploy -- --stage prod
```

### Output esperado:

```
Service Information
service: tienda-be-lambda
stage: dev
region: us-east-1
stack: tienda-be-lambda-dev
resources: 45
api keys:
  None
endpoints:
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto/{id}
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto
  PUT - https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto/{id}
  DELETE - https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto/{id}
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/register
  POST - https://xxx.execute-api.us-east-1.amazonaws.com/dev/login
  GET - https://xxx.execute-api.us-east-1.amazonaws.com/dev/confirm/{token}
functions:
  getProductos: tienda-be-lambda-dev-getProductos
  getProductosById: tienda-be-lambda-dev-getProductosById
  createProducto: tienda-be-lambda-dev-createProducto
  updateProducto: tienda-be-lambda-dev-updateProducto
  deleteProducto: tienda-be-lambda-dev-deleteProducto
  createUser: tienda-be-lambda-dev-createUser
  loginUser: tienda-be-lambda-dev-loginUser
  confirmUser: tienda-be-lambda-dev-confirmUser

Stack Outputs:
  ServiceEndpoint: https://xxx.execute-api.us-east-1.amazonaws.com/dev
```

## Paso 6: Verificar Despliegue

```bash
# Obtener la URL de tu API
API_URL=$(aws cloudformation describe-stacks --stack-name tienda-be-lambda-dev --query 'Stacks[0].Outputs[0].OutputValue' --output text)

# Probar endpoint
curl -X GET ${API_URL}/producto
```

## Paso 7: Monitorear Ejecución

### Ver logs en CloudWatch

```bash
# Logs de una función específica
serverless logs -f getProductos --stage dev --tail

# O desde AWS CLI
aws logs tail /aws/lambda/tienda-be-lambda-dev-getProductos --follow
```

### Ver invocaciones en AWS Console

1. Accede a [AWS Lambda Console](https://console.aws.amazon.com/lambda)
2. Selecciona tu región (us-east-1)
3. Busca tu función y revisa:
   - Pestaña "Monitor" → CloudWatch Metrics
   - Pestaña "Logs" → Recent invocations

## Paso 8: Actualizar Frontend

Cambia la URL de tu frontend para usar la API desplegada:

```javascript
// Antes (Express local):
const API_URL = 'http://localhost:3000/api/v1';

// Después (Lambda):
const API_URL = 'https://xxx.execute-api.us-east-1.amazonaws.com/dev';
```

## Costos Esperados (Capa Gratuita)

| Servicio | Límite Gratis/Mes | Tu Uso |
|----------|-------------------|--------|
| Lambda | 1,000,000 invocaciones | ~30,000 (estimado) |
| API Gateway | 1,000,000 llamadas | ~30,000 |
| CloudWatch | 5GB logs + 1 alarma | ~50MB |
| **COSTO** | **$0** | **$0** |

## Troubleshooting

### Error: "Unable to assume IAM role"
```bash
# Verificar que AWS CLI está configurado
aws sts get-caller-identity

# Respuesta esperada:
# {
#     "Account": "123456789012",
#     "UserId": "AIDAI...",
#     "Arn": "arn:aws:iam::123456789012:user/tu-usuario"
# }
```

### Error: "MongoDB connection timeout"
- Verifica que MongoDB esté accesible desde Lambda
- Si usas Atlas, agrega IP `0.0.0.0/0` en Network Access (no recomendado para prod)
- O usa VPC de Lambda conectado a tu base de datos

### Error: "401 Unauthorized" en endpoints protegidos
- Asegúrate de enviar el JWT token en headers:
  ```bash
  curl -X GET http://localhost:3000/dev/producto \
    -H "Authorization: Bearer tu_token_aqui"
  ```

### Función tarda mucho o timeout (>15min)
- Lambda tiene límite de 15 minutos de ejecución
- Optimiza consultas a BD
- Considera usar Lambda con menos memoria (reduce costo y timeout)

## Rollback

Para volver a la versión anterior:

```bash
# Ver versiones desplegadas
serverless info --stage dev

# Eliminar despliegue actual
serverless remove --stage dev
```

## Próximos Pasos Recomendados

1. **Configurar Custom Domain** (opcional, costo extra)
   ```bash
   # Para usar tu propio dominio en lugar de xxx.execute-api...
   # Requiere certificado SSL
   ```

2. **Añadir Autenticación API Key** (seguridad)
   ```yaml
   # En serverless.yml
   functions:
     getProductos:
       handler: src/lambda/getProductos.handler
       events:
         - http:
             path: /producto
             method: get
             cors: true
             private: true  # Requiere API Key
   ```

3. **Configurar Auto-scaling** (para produccción)
   - Lambda auto-scala automáticamente
   - API Gateway throttling (recomendado para capa gratuita)

4. **Migrations y Seeding** (si es necesario)
   - Ejecuta migraciones manualmente o vía Lambda
   - Carga datos iniciales en MongoDB

## Contacto y Soporte

- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Free Tier](https://aws.amazon.com/free/)