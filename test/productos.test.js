const request = require('supertest');
const app = require('../index');

describe('API de Productos', () => {
  it('GET /api/v1/producto debe devolver status 200 y un array', async () => {
    const res = await request(app).get('/api/v1/producto');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.response)).toBe(true);
  }, 10000);

  it('POST /api/v1/producto debe crear un producto y devolver status 201', async () => {
    const producto = {
      descripcion: 'Producto de prueba',
      precio: 100,
      // agrega aquí otros campos requeridos por tu modelo
    };
    const res = await request(app)
      .post('/api/v1/producto')
      .send(producto)
      .set('Accept', 'application/json');
      expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('response');
  });

  it('GET /api/v1/producto/:id debe devolver un producto o 404 si no existe', async () => {
    // Primero creamos un producto para obtener un id válido
    const producto = { descripcion: 'Producto test', precio: 50 };
    const crear = await request(app)
      .post('/api/v1/producto')
      .send(producto)
      .set('Accept', 'application/json');
    const id = crear.body.response?._id;
    if (id) {
      const res = await request(app).get(`/api/v1/producto/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.response).toHaveProperty('_id', id);
    }
  });

  it('DELETE /api/v1/producto/:id debe eliminar un producto y devolver status 200', async () => {
    // Creamos un producto para eliminarlo
    const producto = { descripcion: 'Producto a eliminar', precio: 10 };
    const crear = await request(app)
      .post('/api/v1/producto')
      .send(producto)
      .set('Accept', 'application/json');
    const id = crear.body.response?._id;
    if (id) {
      const res = await request(app).delete(`/api/v1/producto/${id}`);
      expect(res.statusCode).toBe(200);
    }
  });

  it('PUT /api/v1/producto/:id debe actualizar un producto y devolver status 200', async () => {
    // Creamos un producto para actualizarlo
    const producto = { descripcion: 'Producto a actualizar', precio: 20 };
    const crear = await request(app)
      .post('/api/v1/producto')
      .send(producto)
      .set('Accept', 'application/json');
    const id = crear.body.response?._id;
    if (id) {
      const actualizado = { descripcion: 'Producto actualizado', precio: 25 };
      const res = await request(app)
        .put(`/api/v1/producto/${id}`)
        .send(actualizado)
        .set('Accept', 'application/json');
      expect(res.statusCode).toBe(200);
      expect(res.body.response.descripcion).toBe('Producto actualizado');
    }
  });
  
});