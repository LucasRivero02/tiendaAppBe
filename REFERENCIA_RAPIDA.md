# 📌 REFERENCIA RÁPIDA - Migración Express → Lambda

## 1️⃣ Testing Local (5 minutos)

```bash
# Crear .env
cat > .env << EOF
MONGODB=mongodb+srv://user:pass@cluster/db
SECRET_KEY=my_jwt_key_123
FRONTEND_URL=http://localhost:3000
EOF

# Iniciar
npm run offline

# Probar (en otra terminal)
curl http://localhost:3000/dev/producto
```

## 2️⃣ Desplegar en AWS (5 minutos)

```bash
# Configurar AWS
aws configure
# Pegar: Access Key, Secret Key, us-east-1, json

# Desplegar
npm run deploy -- --stage dev

# Obtener URL del output
# https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto
```

## 3️⃣ Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `serverless.yml` | Configuración de Lambda |
| `src/lambda/` | 8 funciones |
| `INICIAR.md` | Tutorial paso-a-paso |
| `RESUMEN_MIGRACION.md` | Overview completo |
| `.env` | Variables secretas |

## 4️⃣ Rutas de API

### Productos
```
GET    /producto              → getProductos.js
GET    /producto/{id}         → getProductosById.js
POST   /producto              → createProducto.js
PUT    /producto/{id}         → updateProducto.js
DELETE /producto/{id}         → deleteProducto.js
```

### Usuarios
```
POST   /register              → createUser.js
POST   /login                 → loginUser.js
GET    /confirm/{token}       → confirmUser.js
```

## 5️⃣ Troubleshooting

| Problema | Solución |
|----------|----------|
| `npm run offline` falla | `npm install` + verificar `.env` |
| `npm run deploy` falla | `aws configure` + `aws sts get-caller-identity` |
| Endpoint 500 en AWS | `serverless logs -f nombreFuncion --tail` |
| "MongoDB connection" | Verificar URI en `.env` + IP en Atlas |

## 6️⃣ Verificar Instalación

```bash
# Check Node
node --version              # v18+

# Check AWS CLI
aws --version              # v2+

# Check Serverless
npx serverless --version   # v4

# Check dependencias
npm ls serverless-http     # debe estar instalado
```

## 7️⃣ Costos

| Recurso | Límite Gratis |
|---------|---------------|
| Lambda | 1M invocaciones/mes |
| API Gateway | 1M llamadas/mes |
| CloudWatch | 5GB logs + 1 alarma |
| **Total** | **$0** |

Si superas: ~$0.20 por millón invocaciones

## 8️⃣ URLs de Referencia

```
AWS Console: https://console.aws.amazon.com
CloudWatch: https://console.aws.amazon.com/cloudwatch
Lambda: https://console.aws.amazon.com/lambda
MongoDB Atlas: https://cloud.mongodb.com
```

## 9️⃣ Comandos Útiles

```bash
# Desarrollo
npm run offline               # Testing local
npm test                      # Jest tests

# Despliegue
npm run deploy                # Deploy a dev
npm run deploy -- --stage prod  # Deploy a prod

# Monitoreo
serverless logs -f getProductos --tail
serverless info --stage dev
serverless remove --stage dev  # Eliminar deploy

# AWS CLI
aws s3 ls                     # Ver S3 buckets
aws lambda list-functions     # Ver funciones
aws logs tail /aws/lambda/nombreFuncion --follow  # Ver logs
```

## 🔟 Estructura de Carpetas

```
tiendaAppBe/
├── src/
│   ├── lambda/                    ← ⭐ NUEVO
│   │   ├── getProductos.js
│   │   ├── getProductosById.js
│   │   ├── createProducto.js
│   │   ├── updateProducto.js
│   │   ├── deleteProducto.js
│   │   ├── createUser.js
│   │   ├── loginUser.js
│   │   └── confirmUser.js
│   ├── productos/                 ← Reutilizado
│   ├── users/                     ← Reutilizado
│   └── repositories/              ← Reutilizado
├── serverless.yml                 ← ⭐ NUEVO
├── package.json                   ← Modificado
├── INICIAR.md                     ← ⭐ NUEVO
├── RESUMEN_MIGRACION.md          ← ⭐ NUEVO
├── PRUEBAS_PRODUCTOS_LAMBDA.md   ← ⭐ NUEVO
├── DESPLIEGUE_AWS_LAMBDA.md      ← ⭐ NUEVO
└── test-lambda.sh                ← ⭐ NUEVO
```

## 1️⃣1️⃣ Diferencias Express vs Lambda

| Aspecto | Express | Lambda |
|---------|---------|--------|
| Inicio | `npm start` | Event-driven |
| Servidor | Siempre corriendo | Sin servidor |
| Escalado | Manual | Automático |
| Costo | $5-30/mes | Gratis (1M) |
| Deploy | SSH/Git push | `npm run deploy` |
| Logs | Terminal | CloudWatch |
| DB Connection | Persistente | Por invocación |

## 1️⃣2️⃣ Checklist Pre-Despliegue

- [ ] Probado localmente con `npm run offline`
- [ ] `.env` configurado con valores reales
- [ ] AWS CLI configurado (`aws configure`)
- [ ] MongoDB accesible desde Lambda
- [ ] Email funcionando (Nodemailer)
- [ ] CORS configurado en `serverless.yml`
- [ ] Frontend actualizado con URL de API
- [ ] Monitoreo de CloudWatch configurado

## 1️⃣3️⃣ Ejemplo Completo: Crear Producto

```bash
# Local (port 3000)
curl -X POST http://localhost:3000/dev/producto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mouse",
    "precio": 25.99,
    "cantidad": 100
  }'

# AWS Lambda
curl -X POST https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mouse",
    "precio": 25.99,
    "cantidad": 100
  }'
```

## 1️⃣4️⃣ Ejemplo Completo: Login

```bash
curl -X POST http://localhost:3000/dev/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@email.com",
    "password": "password123"
  }'

# Response:
# {
#   "ok": true,
#   "message": "Bienvenido, Username",
#   "token": "eyJhbGc...",
#   "rol": "user"
# }
```

## 1️⃣5️⃣ Próximos Pasos

1. **Lee** INICIAR.md (5 min)
2. **Prueba** `npm run offline` (10 min)
3. **Configura** `aws configure` (5 min)
4. **Desplega** `npm run deploy -- --stage dev` (5 min)
5. **Monitorea** CloudWatch
6. **Actualiza** frontend con nueva URL

---

**¿Preguntas?** Revisa los documentos en el repo o `serverless logs`.

**¡Migración completada! 🎉**
