import { TonClient, Address, OpenedContract } from "@ton/ton";
import { MessageVault } from "../wrappers/MessageVault_MessageVault";
import * as dotenv from 'dotenv';

dotenv.config();

export class TonService {
    private client: TonClient;
    private contract: OpenedContract<MessageVault>;

    constructor() {
        // Inicializa el cliente de TON con Testnet
        this.client = new TonClient({
            endpoint: process.env.TON_API_URL || "https://testnet.toncenter.com/api/v2/jsonRPC",
            apiKey: process.env.TON_API_KEY
        });

        // Parsea la dirección de tu contrato
        const address = Address.parse(process.env.CONTRACT_ADDRESS || "");
        
        // Abre el contrato usando el Wrapper generado por Tact
        const vault = MessageVault.fromAddress(address);
        this.contract = this.client.open(vault) as OpenedContract<MessageVault>;
    }

    /**
     * Consulta los Getters del Smart Contract
     */
     async getVaultData() {
        try {
            // Intentamos leer el mensaje (que suele ser lo primero en inicializarse)
            const message = await this.contract.getCurrentMessage(); 
            
            // Usamos un bloque try/catch interno para los valores que pueden fallar si está uninitialized
            let author = "Sin autor (Contrato no activado)";
            let stats = "0";

            try {
                const authorAddr = await this.contract.getLastAuthor();
                author = authorAddr.toString();
                const statsVal = await this.contract.getStats();
                stats = statsVal.toString();
            } catch (e) {
                console.log("Aviso: El contrato aún no tiene autor o stats inicializados.");
            }

            return {
                message: message,
                author: author,
                updateCount: stats,
                contractAddress: process.env.CONTRACT_ADDRESS,
                status: "Online"
            };
        } catch (error) {
            console.error("Error al consultar la blockchain:", error);
            // Si falla el mensaje, es que el contrato realmente no responde
            throw error;
        }
    }
}
