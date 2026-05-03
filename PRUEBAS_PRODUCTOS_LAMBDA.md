# Guía de Pruebas: Productos Lambda

## Requisitos Previos
1. MongoDB corriendo localmente o accesible (e.g., MongoDB Atlas)
2. Variable de entorno MONGODB configurada (o usar la por defecto de serverless.yml)
3. Instalar dependencias: `npm install`

## Iniciar Servidor Local

```bash
npm run offline
```

Verás output similar a:
```
Server ready at http://localhost:3000 🚀
GET /dev/producto
POST /dev/producto
GET /dev/producto/{id}
PUT /dev/producto/{id}
DELETE /dev/producto/{id}
```

## Probar Endpoints

### 1. Obtener Todos los Productos (GET)

```bash
curl -X GET http://localhost:3000/dev/producto
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Productos",
  "response": [
    {
      "_id": "123abc",
      "nombre": "Laptop",
      "precio": 999.99,
      "...": "..."
    }
  ],
  "total": 1
}
```

---

### 2. Obtener Producto por ID (GET)

```bash
curl -X GET http://localhost:3000/dev/producto/PRODUCTO_ID_AQUI
```

**Respuesta exitosa (200)**:
```json
{
  "response": {
    "_id": "123abc",
    "nombre": "Laptop",
    "precio": 999.99
  }
}
```

**Si no existe (404)**:
```json
{
  "message": "Not found"
}
```

---

### 3. Crear Producto (POST)

```bash
curl -X POST http://localhost:3000/dev/producto \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mouse Gamer",
    "precio": 45.99,
    "cantidad": 50,
    "descripcion": "Mouse óptico 3200 DPI"
  }'
```

**Respuesta exitosa (201)**:
```json
{
  "message": "El Producto se creo correctamente",
  "response": {
    "_id": "nuevaId",
    "nombre": "Mouse Gamer",
    "precio": 45.99,
    "cantidad": 50,
    "descripcion": "Mouse óptico 3200 DPI"
  }
}
```

---

### 4. Actualizar Producto (PUT)

```bash
curl -X PUT http://localhost:3000/dev/producto/PRODUCTO_ID_AQUI \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 39.99,
    "cantidad": 45
  }'
```

**Respuesta exitosa (200)**:
```json
{
  "message": "El producto se actualizo correctamente",
  "response": {
    "_id": "PRODUCTO_ID_AQUI",
    "nombre": "Mouse Gamer",
    "precio": 39.99,
    "cantidad": 45,
    "descripcion": "Mouse óptico 3200 DPI"
  }
}
```

---

### 5. Eliminar Producto (DELETE)

```bash
curl -X DELETE http://localhost:3000/dev/producto/PRODUCTO_ID_AQUI
```

**Respuesta exitosa (200)**:
```json
{
  "message": "El producto se borro correctamente",
  "data": {
    "_id": "PRODUCTO_ID_AQUI",
    "nombre": "Mouse Gamer",
    "precio": 39.99
  }
}
```

---

## Probar con Postman/Insomnia

### Variables de Entorno (Postman)

```json
{
  "base_url": "http://localhost:3000/dev",
  "product_id": ""
}
```

### Requests de Ejemplo

**GET - Todos los productos**
```
GET {{base_url}}/producto
```

**POST - Crear producto** (Guardar ID)
```
POST {{base_url}}/producto
Body: raw JSON
{
  "nombre": "Keyboard Mecánico",
  "precio": 120.00,
  "cantidad": 30,
  "descripcion": "RGB Switches Brown"
}
```

---

## Troubleshooting

### Error: "Cannot resolve MongoDB connection"
- Verifica que MongoDB esté corriendo
- Comprueba la variable `MONGODB` en `serverless.yml`
- Prueba: `npm run offline` sin cambios

### Error: "port 3000 already in use"
- Cambia el puerto: `npm run offline -- --port 3001`
- O mata el proceso: `lsof -ti:3000 | xargs kill -9`

### Error: "No modules named X"
- Ejecuta: `npm install`
- Verifica que `src/repositories/productosRepositories.js` existe

### Logs insuficientes
- Busca logs de Lambda en el output de `serverless offline`
- Añade `console.log()` en `src/lambda/getProductos.js` para debug
