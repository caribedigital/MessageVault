import express from 'express';
import cors from 'cors';
import { TonService } from './services/tonService';

const app = express();
const port = process.env.PORT || 4000;

// Habilita CORS para permitir peticiones desde el Frontend (puerto 3000)
app.use(cors());
app.use(express.json());

const tonService = new TonService();

/**
 * Endpoint de Salud (Prueba de conectividad)
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'Middleware Online', network: 'TON Testnet' });
});

/**
 * Endpoint Principal: Obtiene el estado actual del contrato
 */
app.get('/api/vault', async (req, res) => {
    try {
        const data = await tonService.getVaultData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'No se pudo conectar con el Smart Contract',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Middleware de Sanidad TON corriendo en http://localhost:${port}`);
});
