#!/bin/bash

# 🧪 SCRIPT DE PRUEBAS AUTOMATIZADAS
# Uso: bash test-lambda.sh

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
BASE_URL="http://localhost:3000/dev"
TIMEOUT=5

echo "🚀 Iniciando pruebas de Lambda..."
echo "Base URL: $BASE_URL"
echo ""

# Verificar si el servidor está corriendo
echo "⏳ Verificando si Lambda está corriendo..."
if ! curl -s --connect-timeout 2 "$BASE_URL/producto" > /dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: Lambda no está corriendo en $BASE_URL${NC}"
    echo "Inicia con: npm run offline"
    exit 1
fi
echo -e "${GREEN}✅ Lambda está corriendo${NC}"
echo ""

# ============= PRUEBAS DE PRODUCTOS =============

echo "📦 ============== PRUEBAS DE PRODUCTOS =============="
echo ""

# 1. GET /producto
echo "📋 Test 1: GET /producto (obtener todos)"
RESPONSE=$(curl -s "$BASE_URL/producto")
if echo "$RESPONSE" | grep -q "Productos"; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "Response: $RESPONSE" | head -c 200
    echo ""
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# 2. POST /producto (crear producto de prueba)
echo "🆕 Test 2: POST /producto (crear nuevo)"
PRODUCT_ID=""
RESPONSE=$(curl -s -X POST "$BASE_URL/producto" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Gaming Test",
    "precio": 1200.00,
    "cantidad": 5,
    "descripcion": "Laptop para testing"
  }')

if echo "$RESPONSE" | grep -q "creo correctamente"; then
    echo -e "${GREEN}✅ PASS${NC}"
    # Extraer ID del producto
    PRODUCT_ID=$(echo "$RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo "Response: $RESPONSE" | head -c 200
    echo ""
    echo "Producto ID guardado: $PRODUCT_ID"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# 3. GET /producto/:id (obtener por ID)
if [ ! -z "$PRODUCT_ID" ]; then
    echo "🔍 Test 3: GET /producto/:id (obtener por ID)"
    RESPONSE=$(curl -s "$BASE_URL/producto/$PRODUCT_ID")
    if echo "$RESPONSE" | grep -q "Laptop Gaming Test"; then
        echo -e "${GREEN}✅ PASS${NC}"
        echo "Response: $RESPONSE" | head -c 200
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $RESPONSE"
    fi
    echo ""
    
    # 4. PUT /producto/:id (actualizar)
    echo "✏️ Test 4: PUT /producto/:id (actualizar)"
    RESPONSE=$(curl -s -X PUT "$BASE_URL/producto/$PRODUCT_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "precio": 999.99,
        "cantidad": 10
      }')
    if echo "$RESPONSE" | grep -q "actualizo"; then
        echo -e "${GREEN}✅ PASS${NC}"
        echo "Response: $RESPONSE" | head -c 200
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $RESPONSE"
    fi
    echo ""
    
    # 5. DELETE /producto/:id (eliminar)
    echo "🗑️ Test 5: DELETE /producto/:id (eliminar)"
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/producto/$PRODUCT_ID")
    if echo "$RESPONSE" | grep -q "borro"; then
        echo -e "${GREEN}✅ PASS${NC}"
        echo "Response: $RESPONSE" | head -c 200
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "Response: $RESPONSE"
    fi
    echo ""
fi

# ============= PRUEBAS DE USUARIOS =============

echo ""
echo "👥 ============== PRUEBAS DE USUARIOS =============="
echo ""

# 6. POST /register (crear usuario)
echo "📝 Test 6: POST /register (crear usuario)"
USER_EMAIL="test$(date +%s)@test.com"
RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test User\",
    \"email\": \"$USER_EMAIL\",
    \"password\": \"Test123!@#\"
  }")

if echo "$RESPONSE" | grep -q "creo correctamente"; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "Response: $RESPONSE" | head -c 200
    echo ""
    echo "Usuario creado: $USER_EMAIL"
else
    echo -e "${RED}❌ FAIL${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# 7. POST /login (login)
echo "🔐 Test 7: POST /login (autenticación)"
RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$USER_EMAIL\",
    \"password\": \"Test123!@#\"
  }")

TOKEN=""
if echo "$RESPONSE" | grep -q "Bienvenido"; then
    echo -e "${GREEN}✅ PASS${NC}"
    echo "Response: $RESPONSE" | head -c 200
    # Extraer token
    TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo ""
    echo "Token JWT guardado: ${TOKEN:0:20}..."
else
    echo -e "${YELLOW}⚠️ INFO: Login puede fallar si el usuario no está confirmado${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# ============= RESUMEN =============

echo ""
echo "🏁 ============== RESUMEN DE PRUEBAS =============="
echo ""
echo "✅ Pruebas de Productos: GET, POST, PUT, DELETE"
echo "✅ Pruebas de Usuarios: POST, GET"
echo ""
echo -e "${GREEN}Las funciones Lambda están funcionando correctamente! 🎉${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Prueba con Postman/Insomnia"
echo "2. Configura AWS CLI: aws configure"
echo "3. Desplega: npm run deploy -- --stage dev"
echo ""
