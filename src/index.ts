import express from 'express';
import cors from 'cors';
import { TonService } from './services/tonService';

const app = express();
// Render inyectará automáticamente el puerto en process.env.PORT
const port = process.env.PORT || 4000;

// MEJORA: En producción, Render usa HTTPS. 
// Dejamos cors() abierto para que Vercel pueda consultar sin bloqueos.
app.use(cors());
app.use(express.json());

const tonService = new TonService();

/**
 * Endpoint de Salud
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'Middleware Online', network: 'TON Testnet' });
});

/**
 * Endpoint Principal
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

// CAMBIO CRÍTICO PARA RENDER:
// 1. Agregamos '0.0.0.0' para que el servicio sea accesible externamente.
// 2. Quitamos 'http://localhost' del console.log porque en Render la URL será distinta.
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Middleware MessageVault activo en el puerto ${port}`);
});
