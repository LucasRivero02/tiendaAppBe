# ✅ CHECKLIST COMPLETO - Migración Express → Lambda

## 🎯 Migración Completada

### ✅ Funciones Lambda Creadas (8/8)

```
[✓] src/lambda/getProductos.js          - GET /producto
[✓] src/lambda/getProductosById.js      - GET /producto/:id
[✓] src/lambda/createProducto.js        - POST /producto
[✓] src/lambda/updateProducto.js        - PUT /producto/:id
[✓] src/lambda/deleteProducto.js        - DELETE /producto/:id
[✓] src/lambda/createUser.js            - POST /register
[✓] src/lambda/loginUser.js             - POST /login
[✓] src/lambda/confirmUser.js           - GET /confirm/:token
```

### ✅ Configuración (2/2)

```
[✓] serverless.yml                      - Configuración completa
[✓] package.json                        - Scripts nuevos (offline, deploy)
```

### ✅ Dependencias Instaladas (3/3)

```
[✓] serverless@^4.35.0                  - Framework
[✓] serverless-http@^4.0.0              - Express adapter
[✓] serverless-offline@^14.5.0          - Testing local
```

### ✅ Documentación (5/5)

```
[✓] INICIAR.md                          - Tutorial rápido (5 min)
[✓] REFERENCIA_RAPIDA.md                - Comandos clave (2 min)
[✓] RESUMEN_MIGRACION.md                - Overview técnico (10 min)
[✓] PRUEBAS_PRODUCTOS_LAMBDA.md         - Ejemplos testing (15 min)
[✓] DESPLIEGUE_AWS_LAMBDA.md            - Guía AWS (20 min)
```

### ✅ Scripts Auxiliares

```
[✓] test-lambda.sh                      - Testing automático
[✓] BIENVENIDA.txt                      - Resumen visual
```

---

## 🚀 PRÓXIMOS PASOS (Para Empezar)

### Fase 1: Testing Local (15 minutos)

```
[ ] 1. Crear archivo .env con MongoDB + secrets
    cat > .env << EOF
    MONGODB=mongodb+srv://user:pass@cluster.mongodb.net/tienda
    SECRET_KEY=my_jwt_secret_key
    FRONTEND_URL=http://localhost:3000
    EOF

[ ] 2. Instalar dependencias
    npm install

[ ] 3. Iniciar servidor local
    npm run offline

[ ] 4. Probar endpoints (en otra terminal)
    curl http://localhost:3000/dev/producto

[ ] 5. Ejecutar testing automático
    bash test-lambda.sh
```

### Fase 2: Desplegar en AWS (15 minutos)

```
[ ] 1. Crear cuenta AWS (si no la tienes)
    https://aws.amazon.com/free/

[ ] 2. Crear usuario IAM con permisos Lambda
    AWS Console → IAM → Create User

[ ] 3. Instalar AWS CLI
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip && sudo ./aws/install

[ ] 4. Configurar AWS CLI
    aws configure
    (Ingresar: Access Key, Secret Key, us-east-1, json)

[ ] 5. Validar configuración
    aws sts get-caller-identity

[ ] 6. Desplegar en AWS
    npm run deploy -- --stage dev

[ ] 7. Copiar URL del output y probar
    curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto

[ ] 8. Ver logs en CloudWatch
    serverless logs -f getProductos --tail
```

### Fase 3: Configuración Post-Despliegue (30 minutos)

```
[ ] 1. Monitoreo: Configurar alarmas en CloudWatch
    AWS Console → CloudWatch → Alarms

[ ] 2. Seguridad: Añadir API Key a endpoints
    serverless.yml → functions → private: true

[ ] 3. Optimización: Ajustar memoria y timeout
    serverless.yml → provider → memorySize, timeout

[ ] 4. Frontend: Actualizar URL de API
    const API_URL = 'https://xxx.execute-api.us-east-1.amazonaws.com/dev'

[ ] 5. Base de datos: Verificar backups
    MongoDB Atlas → Backup → Enable

[ ] 6. Logging: Configurar retención de logs
    CloudWatch → Log Groups → Retention
```

---

## 📋 VALIDACIÓN LOCAL

### Validar que Todo Funciona

```
[ ] npm run offline       # Servidor iniciado correctamente
[ ] npm test              # Todos los tests pasan
[ ] curl endpoint         # Endpoints responden
[ ] bash test-lambda.sh   # Script de testing pasa
```

### URLs Locales de Prueba

```
[ ] GET    http://localhost:3000/dev/producto
[ ] POST   http://localhost:3000/dev/producto (con body)
[ ] GET    http://localhost:3000/dev/producto/123
[ ] PUT    http://localhost:3000/dev/producto/123 (con body)
[ ] DELETE http://localhost:3000/dev/producto/123
[ ] POST   http://localhost:3000/dev/register (con body)
[ ] POST   http://localhost:3000/dev/login (con body)
[ ] GET    http://localhost:3000/dev/confirm/token
```

---

## 🔐 VALIDACIÓN DE SEGURIDAD

### Antes de Despliegue

```
[ ] .env NO está en git (.gitignore)
[ ] SECRET_KEY es segura (>32 chars, aleatorio)
[ ] MONGODB URI usa usuario con password
[ ] MongoDB Atlas tiene restricción de IP (si aplica)
[ ] No hay credenciales en serverless.yml
[ ] No hay console.log de datos sensibles
[ ] CORS está configurado correctamente
```

### Después de Despliegue

```
[ ] Verificar que endpoints requieren autenticación donde corresponde
[ ] Probar que JWT token es validado
[ ] Verificar rate limiting (si está configurado)
[ ] Revisar logs en CloudWatch (no hay errores)
[ ] Verificar que MongoDB no es públicamente accesible
[ ] Test de SQL injection / XSS (si aplica)
```

---

## 💰 VALIDACIÓN DE COSTOS

### Antes de Despliegue

```
[ ] Verificar límites de capa gratuita
    AWS Console → Billing Dashboard

[ ] Configurar alertas de costos
    AWS Console → Billing → Alerts

[ ] Calcular uso estimado
    Rutas × invocaciones/mes × tamaño RAM
```

### Después de Despliegue

```
[ ] Revisar métricas de invocaciones
    Lambda Console → Function → Monitor

[ ] Revisar duración promedio
    CloudWatch → Metrics → Duration

[ ] Revisar errores
    CloudWatch → Logs → Errors
```

---

## 📊 VALIDACIÓN DE FUNCIONALIDAD

### Endpoints de Productos

```
[ ] GET /producto          - Obtener todos (sin autenticación)
[ ] POST /producto         - Crear (posiblemente requiere auth)
[ ] GET /producto/:id      - Obtener por ID
[ ] PUT /producto/:id      - Actualizar
[ ] DELETE /producto/:id   - Eliminar
```

### Endpoints de Usuarios

```
[ ] POST /register         - Crear usuario (sin autenticación)
[ ] POST /login            - Autenticación (retorna JWT)
[ ] GET /confirm/:token    - Confirmar email
```

### Flujo Completo

```
[ ] 1. Registrar usuario: POST /register
[ ] 2. Confirmar email: GET /confirm/{token}
[ ] 3. Login: POST /login → obtener JWT
[ ] 4. Crear producto: POST /producto + JWT
[ ] 5. Listar productos: GET /producto
[ ] 6. Actualizar producto: PUT /producto/:id + JWT
[ ] 7. Eliminar producto: DELETE /producto/:id + JWT
```

---

## 🛠️ COMANDOS DE UTILIDAD

### Development

```bash
npm run offline              # Testing local
npm run offline -- --port 3001  # Puerto diferente
npm test                     # Jest tests
npm start                    # Express original
```

### Despliegue

```bash
npm run deploy               # Deploy a 'dev' (default)
npm run deploy -- --stage prod  # Deploy a 'prod'
serverless info --stage dev  # Ver información del stack
serverless remove --stage dev  # Eliminar despliegue
```

### Monitoreo

```bash
serverless logs -f getProductos --tail
serverless logs -f getProductos --stage dev --tail
serverless logs -f createProducto --startTime 10m

aws logs tail /aws/lambda/tienda-be-lambda-dev-getProductos --follow
aws lambda list-functions --region us-east-1
aws cloudwatch get-metric-statistics ...
```

### AWS CLI

```bash
aws configure               # Configurar credenciales
aws sts get-caller-identity # Verificar credenciales
aws s3 ls                   # Ver S3 buckets
aws lambda list-functions   # Ver funciones Lambda
aws logs describe-log-groups # Ver log groups
```

---

## 📖 LECTURA RECOMENDADA (En Orden)

```
1. INICIAR.md (5 min)           ⭐ COMIENZA AQUÍ
   └─ Tutorial rápido
   
2. REFERENCIA_RAPIDA.md (2 min)
   └─ Comandos + troubleshooting
   
3. RESUMEN_MIGRACION.md (10 min)
   └─ Overview técnico
   
4. PRUEBAS_PRODUCTOS_LAMBDA.md (15 min)
   └─ Ejemplos con curl
   
5. DESPLIEGUE_AWS_LAMBDA.md (20 min)
   └─ Guía AWS completa
```

---

## ❓ TROUBLESHOOTING RÁPIDO

### npm run offline falla

```
[ ] npm install                          # Instalar deps
[ ] cat .env                             # Verificar .env existe
[ ] npm ls                               # Verificar deps
[ ] rm -rf node_modules && npm install   # Reinstalar
```

### npm run deploy falla

```
[ ] aws sts get-caller-identity          # Verificar AWS CLI
[ ] aws configure                        # Reconfigurare si falla
[ ] npm install                          # Instalar deps locales
[ ] cat serverless.yml                   # Verificar sintaxis
```

### Endpoint 500

```
[ ] serverless logs -f nombreFuncion --tail  # Ver logs
[ ] aws logs tail /aws/lambda/... --follow   # Ver CloudWatch
[ ] npm run offline                      # Probar localmente primero
```

### MongoDB timeout

```
[ ] ping mongo.ejemplo.com                # Verificar conectividad
[ ] Verificar URI en .env
[ ] Si es Atlas: Agregar IP 0.0.0.0/0 en Network (no seguro)
[ ] Verificar VPC de Lambda si es necesario
```

---

## 🎯 METAS FINALES

### Antes del Lanzamiento

```
[ ] Aplicación funciona localmente (npm run offline)
[ ] Todos los tests pasan (npm test)
[ ] Documentación leída (al menos INICIAR.md)
[ ] AWS CLI configurado (aws configure)
[ ] Base de datos verificada (MongoDB accesible)
[ ] Emails funcionan (Nodemailer testado)
```

### Despliegue en AWS

```
[ ] Desplegado en stage 'dev' (npm run deploy -- --stage dev)
[ ] Endpoints funcionales en AWS
[ ] Logs visibles en CloudWatch
[ ] Monitoreo configurado
[ ] Alertas de costos activadas
```

### Producción

```
[ ] Despliegue en stage 'prod' (npm run deploy -- --stage prod)
[ ] Frontend actualizado con URL de prod
[ ] Backups de BD configurados
[ ] Monitoreo 24/7 activo
[ ] Plan de rollback documentado
```

---

**¿Todo listo? ¡Comienza con INICIAR.md! 🚀**

Tiempo estimado total: **~1 hora** (testing local + AWS)
