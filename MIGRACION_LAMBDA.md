# Documentación de la Migración: Express → AWS Lambda

## Paso 1: Preparación y Instalación ✅
- [x] Instalado Serverless Framework v4 localmente
- [x] Instalado serverless-http (adaptador Express a Lambda)
- [x] Instalado serverless-offline (para pruebas locales)
- [x] Instalado Middy (para middlewares en Lambda)
- [x] Configurado serverless.yml básico

## Paso 2: Estructura de Archivos
Se creó la carpeta `src/lambda/` para las funciones Lambda:
```
src/lambda/
├── getProductos.js    # ← Función migrada de /api/v1/producto (GET)
├── getProductoById.js # (Próxima a migrar)
├── createProducto.js  # (Próxima a migrar)
├── updateProducto.js  # (Próxima a migrar)
└── deleteProducto.js  # (Próxima a migrar)
```

## Paso 3: Primera Función Migrada - getProductos.js ✅

### Cambios principales:
1. **Conexión a MongoDB optimizada**: 
   - Se reutiliza la conexión (evita crear una nueva por cada invocación)
   - Se usa variable `isConnected` para verificar estado

2. **Mini-app Express**:
   - Cada función Lambda tiene su propia instancia de Express
   - Se configura CORS y middleware JSON

3. **Handler de Lambda**:
   - Se exporta usando `serverless-http` que convierte Express a formato AWS Lambda

### Código de ejemplo:
```javascript
const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');

let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB, ...);
    isConnected = true;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/producto', async (req, res) => {
  try {
    await connectToDatabase();
    // Lógica del controlador
  } catch (error) {
    res.status(500).json({ message: 'Error', err: error.message });
  }
});

module.exports.handler = serverless(app);
```

## Paso 4: Configuración en serverless.yml ✅

```yaml
service: tienda-be-lambda

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: dev
  environment:
    MONGODB: ${env:MONGODB, 'mongodb://localhost:27017/tienda'}

functions:
  getProductos:
    handler: src/lambda/getProductos.handler
    events:
      - http:
          path: /producto
          method: get
          cors: true
```

## Paso 5: Próximos Pasos para Completar Migración

### 1. Migrar Rutas Restantes de Productos: ✅
- [x] GET `/producto` → `getProductos.js`
- [x] GET `/producto/:id` → `getProductosById.js`
- [x] POST `/producto` → `createProducto.js`
- [x] PUT `/producto/:id` → `updateProducto.js`
- [x] DELETE `/producto/:id` → `deleteProducto.js`

### 2. Migrar Rutas de Usuarios: ✅
- [x] POST `/register` → `createUser.js`
- [x] POST `/login` → `loginUser.js`
- [x] GET `/confirm/:token` → `confirmUser.js`

### 3. Agregar Autenticación (Middleware):
- [ ] Crear archivo `src/lambda/middleware/authMiddleware.js`
- [ ] Integrar validación de JWT (reutilizar `validate-token.js`)

### 4. Desplegar a AWS:
- [ ] Configurar AWS CLI (credenciales)
- [ ] Crear usuario IAM con permisos Lambda + API Gateway + CloudWatch
- [ ] Ejecutar `serverless deploy` en stage `dev`
- [ ] Verificar endpoints en API Gateway

### 5. Validar Post-Despliegue:
- [ ] Probar endpoints en AWS
- [ ] Revisar logs en CloudWatch
- [ ] Configurar alarmas para errores

## Consideraciones para Capa Gratuita:

1. **Lambda**: 1M invocaciones/mes gratuitas + 400,000 GB-segundos
2. **API Gateway**: 1M llamadas/mes gratuitas
3. **CloudWatch**: 5GB logs/mes gratis + 1 alarma gratis
4. **MongoDB**: Si usas Atlas, 512MB gratis (verificar)

## Comando para Probar Localmente:
```bash
npm run offline
```
Luego acceder a:
- GET: `http://localhost:3000/dev/producto`
- GET by ID: `http://localhost:3000/dev/producto/123`
- POST: `http://localhost:3000/dev/producto` (con JSON en body)
- PUT: `http://localhost:3000/dev/producto/123` (con JSON en body)
- DELETE: `http://localhost:3000/dev/producto/123`

## Comando para Desplegar:
```bash
export MONGODB="tu_mongodb_connection_string"
npm run deploy
```

## Resumen de Cambios en serverless.yml:

```yaml
functions:
  getProductos:
    handler: src/lambda/getProductos.handler
    events:
      - http: { path: /producto, method: get, cors: true }
  
  getProductosById:
    handler: src/lambda/getProductosById.handler
    events:
      - http: { path: /producto/{id}, method: get, cors: true }
  
  createProducto:
    handler: src/lambda/createProducto.handler
    events:
      - http: { path: /producto, method: post, cors: true }
  
  updateProducto:
    handler: src/lambda/updateProducto.handler
    events:
      - http: { path: /producto/{id}, method: put, cors: true }
  
  deleteProducto:
    handler: src/lambda/deleteProducto.handler
    events:
      - http: { path: /producto/{id}, method: delete, cors: true }
```

## Archivos Creados/Modificados:

### Nuevos archivos Lambda:
- `src/lambda/getProductos.js` ✅
- `src/lambda/getProductosById.js` ✅
- `src/lambda/createProducto.js` ✅
- `src/lambda/updateProducto.js` ✅
- `src/lambda/deleteProducto.js` ✅

### Configuración:
- `serverless.yml` ✅ (Configuración completa de Lambda)
- `package.json` ✅ (Scripts agregados: `npm run offline`, `npm run deploy`)
