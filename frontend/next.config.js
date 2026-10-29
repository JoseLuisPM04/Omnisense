// El navegador llama a /api/* en el mismo origen y Next lo reenvía al backend (sin CORS).
// El nombre "backend" es el servicio definido en docker-compose.yml.
module.exports = {
  async rewrites() {
    const destino = process.env.API_URL || 'http://backend:4000';
    return [{ source: '/api/:path*', destination: `${destino}/api/:path*` }];
  },
};
