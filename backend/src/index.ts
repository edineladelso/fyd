import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import downloadRoutes from './routes/download';

const app = express();
app.use(express.json());

// Rotas principais
app.use('/api', downloadRoutes);

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor ativo em http://0.0.0.0:3000');
});
