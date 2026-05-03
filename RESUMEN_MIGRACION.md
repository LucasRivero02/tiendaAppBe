# Resumen de Migración Express → AWS Lambda

## ✅ MIGRACIÓN COMPLETADA

Se han migrado **todas** las rutas de tu API Express a funciones AWS Lambda. La estructura es compatible con la capa gratuita de AWS.

---

## 📊 Estado de Migración

### Rutas de Productos (5/5) ✅
| Ruta | Método | Función Lambda | Estado |
|------|--------|----------------|--------|
| `/producto` | GET | `getProductos.js` | ✅ Migrado |
| `/producto/:id` | GET | `getProductosById.js` | ✅ Migrado |
| `/producto` | POST | `createProducto.js` | ✅ Migrado |
| `/producto/:id` | PUT | `updateProducto.js` | ✅ Migrado |
| `/producto/:id` | DELETE | `deleteProducto.js` | ✅ Migrado |

### Rutas de Usuarios (3/3) ✅
| Ruta | Método | Función Lambda | Estado |
|------|--------|----------------|--------|
| `/register` | POST | `createUser.js` | ✅ Migrado |
| `/login` | POST | `loginUser.js` | ✅ Migrado |
| `/confirm/:token` | GET | `confirmUser.js` | ✅ Migrado |

---

## 📁 Estructura de Archivos Creados

```
tiendaAppBe/
├── src/
│   └── lambda/                    # NUEVA - Funciones Lambda
│       ├── getProductos.js        # GET /producto
│       ├── getProductosById.js    # GET /producto/:id
│       ├── createProducto.js      # POST /producto
│       ├── updateProducto.js      # PUT /producto/:id
│       ├── deleteProducto.js      # DELETE /producto/:id
│       ├── createUser.js          # POST /register
│       ├── loginUser.js           # POST /login
│       └── confirmUser.js         # GET /confirm/:token
├── serverless.yml                 # NUEVO - Configuración Lambda + API Gateway
├── MIGRACION_LAMBDA.md           # Este archivo (guía de migración)
├── PRUEBAS_PRODUCTOS_LAMBDA.md   # NUEVO - Guía de pruebas con curl/Postman
├── DESPLIEGUE_AWS_LAMBDA.md      # NUEVO - Guía de despliegue en AWS
└── package.json                   # MODIFICADO - Scripts `offline` y `deploy`
```

---

## 🔧 Cambios Realizados

### 1. **Nueva Estructura: serverless.yml**
Define todas las funciones Lambda, eventos HTTP, y variables de entorno.
```yaml
functions:
  getProductos:
    handler: src/lambda/getProductos.handler
    events:
      - http: { path: /producto, method: get, cors: true }
```

### 2. **Funciones Lambda Independientes**
Cada ruta tiene su propia función con:
- ✅ Conexión reutilizada a MongoDB (optimizada)
- ✅ Middleware CORS integrado
- ✅ Manejo de errores mejorado
- ✅ Exportada via `serverless-http` para compatibilidad con API Gateway

### 3. **Scripts en package.json**
```json
"scripts": {
  "start": "node index.js",        // Express original (aún funciona)
  "offline": "serverless offline --port 3000",  // Testing local
  "deploy": "serverless deploy",   // Deploy a AWS
  "test": "jest"
}
```

### 4. **Dependencias Nuevas**
```json
{
  "serverless": "^4.35.0",
  "serverless-http": "^3.x",
  "serverless-offline": "^12.x"
}
```

---

## 🚀 Quick Start

### Testing Local (sin AWS)
```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env
cat > .env << EOF
MONGODB=mongodb+srv://usuario:pass@cluster.mongodb.net/tienda
SECRET_KEY=mi_jwt_secret
FRONTEND_URL=http://localhost:3000
EOF

# 3. Iniciar servidor local
npm run offline

# 4. En otra terminal, probar
curl http://localhost:3000/dev/producto
```

### Desplegar en AWS
```bash
# 1. Configurar AWS CLI
aws configure

# 2. Desplegar (requiere .env)
npm run deploy -- --stage dev

# 3. Obtener URL
# La URL se mostrará en el output, ej:
# https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto
```

---

## 📋 Comparación: Express vs Lambda

| Aspecto | Express Anterior | Lambda Nuevo |
|--------|-----------------|--------------|
| **Servidor** | Siempre corriendo (`app.listen`) | Sin servidor (event-driven) |
| **Despliegue** | EC2, Heroku, VPS | AWS Lambda automático |
| **Costo** | $5-30/mes mínimo | Gratis (capa gratuita) |
| **Escalabilidad** | Manual | Automática |
| **Inicio** | ~1 seg (warm) | ~200-500ms (cold start) |
| **Mantenimiento** | Patches SO, upgrades | AWS se encarga |
| **Base de datos** | Conexión persistente | Reutilizada por invocación |
| **Files estáticos** | Servidos por Express | S3 + CloudFront |

---

## 🔒 Seguridad (Importante)

### ✅ Implementado
- [x] JWT para autenticación
- [x] CORS configurado
- [x] Variables de entorno para secrets
- [x] Validación de email

### ⚠️ Próximos pasos (Recomendado)
- [ ] API Key o WAF en API Gateway
- [ ] Rate limiting (evita abuso)
- [ ] Encriptación de datos sensibles
- [ ] Logs centralizados en CloudWatch
- [ ] Backups automáticos de MongoDB

---

## 📚 Documentación Incluida

1. **MIGRACION_LAMBDA.md** ← Estás aquí
   - Overview de la migración
   - Cambios principales
   - Próximos pasos

2. **PRUEBAS_PRODUCTOS_LAMBDA.md**
   - Ejemplos con curl
   - Postman/Insomnia configs
   - Troubleshooting

3. **DESPLIEGUE_AWS_LAMBDA.md**
   - Guía paso-a-paso para AWS
   - Configuración de credenciales
   - Monitoreo con CloudWatch
   - Costos y optimización

---

## ❓ Preguntas Frecuentes

### ¿Puedo seguir usando Express localmente?
Sí. El archivo `index.js` original sigue funcionando:
```bash
npm start  # Inicia Express en puerto 3000 (local)
```

### ¿Qué pasa con los archivos estáticos (public/)?
En Lambda, deben servirse desde S3 + CloudFront. Por ahora están deshabilitados en Lambda pero siguen en Express.

### ¿Cuánto me costará?
**$0** en capa gratuita (hasta 1M invocaciones/mes). Si superas ese límite, ~$0.20 por 1M invocaciones adicionales.

### ¿Cómo agrego autenticación a rutas?
Cada función Lambda puede validar el JWT token en `Authorization` header:
```javascript
const token = req.headers.authorization?.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Unauthorized' });
```

### ¿Qué pasa con el email (Nodemailer)?
Sigue funcionando igual. Solo asegúrate de que `SMTP_USER` y `SMTP_PASS` estén en variables de entorno en `serverless.yml`.

---

## 🎯 Próximos Pasos Recomendados

1. **Prueba localmente** (npm run offline)
2. **Configura AWS CLI** (aws configure)
3. **Desplega a dev** (npm run deploy -- --stage dev)
4. **Prueba endpoints en AWS**
5. **Configura monitoreo** (CloudWatch alarms)
6. **Migra a prod** cuando estés listo

---

## 📞 Soporte

Si tienes errores:
1. Revisa `PRUEBAS_PRODUCTOS_LAMBDA.md` → Troubleshooting
2. Revisa `DESPLIEGUE_AWS_LAMBDA.md` → Troubleshooting
3. Verifica logs: `serverless logs -f nombreFuncion --tail`
4. AWS CloudWatch Console → Logs

---

## 📝 Checklist Final

Antes de desplegar a producción, verifica:

- [ ] Todas las rutas probadas localmente (npm run offline)
- [ ] `.env` configurado con credenciales reales
- [ ] AWS CLI configurado (aws configure)
- [ ] MongoDB accesible desde Lambda (test de conexión)
- [ ] Emails funcionan (Nodemailer/SES)
- [ ] CORS configurado correctamente en serverless.yml
- [ ] Logs monitoreados en CloudWatch
- [ ] Frontend actualizado con nueva URL de API
- [ ] Backups de BD configurados
- [ ] Límites de costos verificados en AWS Billing

---

**¡Migración completada! 🎉**

Tienes una API serverless lista para escalar. Comienza probando localmente y luego despliega a AWS.
