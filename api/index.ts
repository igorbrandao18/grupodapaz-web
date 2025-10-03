import express from "express";
import { registerRoutes } from "./server/routes";

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Registrar rotas
registerRoutes(app).then(() => {
  console.log('Routes registered successfully');
}).catch((error) => {
  console.error('Error registering routes:', error);
});

// Exportar para Vercel
export default app;
