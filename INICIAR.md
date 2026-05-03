👋 # COMIENZA AQUÍ - Migración Express → AWS Lambda

## ¿Qué se ha hecho?

Se ha completado la **migración completa** de tu API Express a AWS Lambda:

✅ **8 Funciones Lambda** creadas (todas tus rutas)
✅ **Configuración serverless.yml** lista para desplegar
✅ **Documentación completa** para testing y despliegue
✅ **Compatible con capa gratuita AWS** ($0 al principio)

---

## 📖 Lee primero (5 min)

1. **[RESUMEN_MIGRACION.md](RESUMEN_MIGRACION.md)** ← Empieza aquí
   - Qué cambió
   - Estructura de archivos
   - Quick start

---

## 🧪 Prueba Localmente (10 min)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env con tu MongoDB
cat > .env << EOF
MONGODB=mongodb+srv://user:pass@cluster.mongodb.net/tienda
SECRET_KEY=my_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000
EOF

# 3. Iniciar servidor local
npm run offline

# 4. En otra terminal, probar
curl http://localhost:3000/dev/producto
```

**Detalles de pruebas:** Ver [PRUEBAS_PRODUCTOS_LAMBDA.md](PRUEBAS_PRODUCTOS_LAMBDA.md)

---

## 🚀 Desplega en AWS (15 min)

### Requisitos
- Cuenta AWS activa (capa gratuita)
- AWS CLI instalado

### Pasos

```bash
# 1. Configurar AWS CLI
aws configure
# Ingresar: Access Key, Secret Key, región (us-east-1), formato (json)

# 2. Desplegar
npm run deploy -- --stage dev

# 3. Copiar URL del output y probar
curl https://xxx.execute-api.us-east-1.amazonaws.com/dev/producto
```

**Guía completa:** Ver [DESPLIEGUE_AWS_LAMBDA.md](DESPLIEGUE_AWS_LAMBDA.md)

---

## 📁 Archivos Nuevos

### Funciones Lambda (en `src/lambda/`)
```
✅ getProductos.js        → GET /producto
✅ getProductosById.js    → GET /producto/:id
✅ createProducto.js      → POST /producto
✅ updateProducto.js      → PUT /producto/:id
✅ deleteProducto.js      → DELETE /producto/:id
✅ createUser.js          → POST /register
✅ loginUser.js           → POST /login
✅ confirmUser.js         → GET /confirm/:token
```

### Configuración
```
✅ serverless.yml         → Configuración de Lambda + API Gateway
```

### Documentación
```
✅ RESUMEN_MIGRACION.md         → Overview (EMPIEZA AQUÍ)
✅ PRUEBAS_PRODUCTOS_LAMBDA.md  → Guía de testing
✅ DESPLIEGUE_AWS_LAMBDA.md     → Guía de despliegue en AWS
✅ INICIAR.md                   → Este archivo
```

---

## 🔧 Scripts Nuevos

```bash
npm run offline              # Testing local (puerto 3000)
npm run deploy               # Deploy a AWS Lambda
npm run deploy -- --stage prod  # Deploy a producción

# Anterior (sigue funcionando)
npm start                    # Express local
npm test                     # Jest tests
```

---

## ❓ Decisiones Importantes

### Opción 1: Testing Local
✅ Recomendado antes de desplegar
```bash
npm run offline
```
Ventajas:
- No gastas cuota AWS
- Desarrollo rápido
- Puedes debuggear

### Opción 2: Desplegar a AWS Directamente
```bash
npm run deploy -- --stage dev
```
Ventajas:
- Pruebas con la infraestructura real
- Monitoreo en CloudWatch
- Preparación para producción

**Recomendación:** Haz ambas. Primero local, luego AWS.

---

## 💰 Costos en Capa Gratuita

| Servicio | Límite Gratis | Tu Uso Estimado |
|----------|---------------|-----------------|
| Lambda | 1M invocaciones/mes | ~30-50k |
| API Gateway | 1M llamadas/mes | ~30-50k |
| CloudWatch | 5GB logs/mes | ~50-100MB |
| **Total** | **Gratis** | **$0** |

**Si superas 1M invocaciones:** ~$0.20 por millón adicionales

---

## 🎯 Próximos Pasos

```
1. Lee RESUMEN_MIGRACION.md (5 min)
   ↓
2. Prueba localmente: npm run offline (10 min)
   ↓
3. Configura AWS CLI: aws configure (5 min)
   ↓
4. Desplega: npm run deploy -- --stage dev (5 min)
   ↓
5. Prueba endpoints en AWS (5 min)
   ↓
6. Configura frontend con nueva URL API
   ↓
7. ¡Listo! 🎉
```

---

## 🚨 Troubleshooting Rápido

### "npm run offline" falla
```bash
# Verificar variables .env
cat .env

# Asegurar que MongoDB esté corriendo
# O usar MongoDB Atlas URI
```

### "npm run deploy" falla
```bash
# Verificar AWS CLI
aws sts get-caller-identity

# Si no funciona, configurar credenciales
aws configure
```

### Endpoint devuelve 500 en AWS
```bash
# Ver logs
serverless logs -f getProductos --tail

# O en AWS Console
# Lambda → Tu función → Logs (CloudWatch)
```

---

## 📚 Documentos Completos

| Documento | Para Qué | Duración |
|-----------|----------|----------|
| **RESUMEN_MIGRACION.md** | Entender qué cambió | 10 min |
| **PRUEBAS_PRODUCTOS_LAMBDA.md** | Probar endpoints | 15 min |
| **DESPLIEGUE_AWS_LAMBDA.md** | Desplegar en AWS | 20 min |
| **Este archivo** | Comenzar rápido | 5 min |

---

## ✨ Cambios Principales Respecto a Express

| Antes (Express) | Ahora (Lambda) |
|-----------------|----------------|
| 1 servidor siempre corriendo | 8 funciones serverless |
| `npm start` en VPS | `npm run deploy` en AWS |
| $5-30/mes | Gratis (capa gratuita) |
| Manual scaling | Auto-scaling |
| 1 index.js grande | 8 handlers separados |

---

## 🔐 Seguridad

✅ **Ya implementado:**
- JWT authentication
- CORS
- Environment variables para secrets

⚠️ **Todavía necesita:**
- [ ] API Key en API Gateway
- [ ] Rate limiting
- [ ] WAF (Web Application Firewall)

Ver [DESPLIEGUE_AWS_LAMBDA.md](DESPLIEGUE_AWS_LAMBDA.md) para más seguridad.

---

## 💬 Dudas Específicas

### ¿Dónde está el código original?
En `src/` siguen existiendo los archivos originales:
- `src/productos/` - Controladores
- `src/users/` - Controladores
- `src/repositories/` - Acceso a BD
- `index.js` - Express original (aún funciona)

Las funciones Lambda reutilizan el código original.

### ¿Puedo seguir usando Express?
Sí. `npm start` sigue funcionando igual que antes. Pero para producción, Lambda es más eficiente y barato.

### ¿Qué pasa con mi base de datos?
MongoDB sigue igual. Solo debes asegurar que sea accesible desde Lambda (MongoDB Atlas recomendado).

### ¿Y mis archivos estáticos (public/)?
En Lambda, son mejor en S3 + CloudFront. Por ahora están deshabilitados pero Express original los sigue sirviendo.

---

## 🎓 Aprende Más

- [AWS Lambda oficial](https://aws.amazon.com/lambda/)
- [Serverless Framework docs](https://www.serverless.com/framework/docs)
- [Express.js docs](https://expressjs.com/)

---

## 📞 Soporte

Si algo falla:
1. Revisa la sección "Troubleshooting" de cada documento
2. Verifica los logs: `serverless logs -f nombreFuncion --tail`
3. Revisa AWS CloudWatch Console

---

**¡Listo para comenzar? 🚀**

```bash
# 1. Lee RESUMEN_MIGRACION.md
# 2. npm run offline
# 3. npm run deploy -- --stage dev
# 4. ¡A por más! 🎉
```
