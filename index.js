const express = require('express');
const app = express();

// Configurar leitura de JSON e limite máximo de 5MB por payload
app.use(express.json({ limit: '5mb' }));

// Habilitar CORS para o marketplace conseguir se conectar
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-jojapi-key');
    if (req.method === 'OPTIONS') {
        return res.status(204).send('');
    }
    next();
});

// Endpoint Principal de Extração
app.post('/', async (req, res) => {
    // 1. Validação do Token de Segurança da JoJ API
    // Substitua pelo token completo (ex: jk_8x2co...) que você copiou do painel
    const TOKEN_SECRETO_JOJAPI = "jk_8x2coi4ddflE66bju6e3e38b7EGs15xhDeck2f27cD97u5lKd9v991d4mab4zaW3"; 
    const tokenRecebido = req.headers['x-jojapi-key'] || req.headers['authorization']?.split(' ')[1];

    if (!tokenRecebido || tokenRecebido !== TOKEN_SECRETO_JOJAPI) {
        return res.status(401).json({ 
            erro: "Não autorizado. Requisição sem token ou token inválido." 
        });
    }

    // 2. Verificação da entrada do payload
    const { imagem_base64 } = req.body;
    if (!imagem_base64) {
        return res.status(400).json({ 
            erro: "O parâmetro 'imagem_base64' é obrigatório no corpo do JSON." 
        });
    }

    try {
        // --- SEU MOTOR DE OCR VAI AQUI ---
        
        // Retorno estruturado padrão para o mercado Angolano (Moeda: AOA)
        const respostaSucesso = {
            sucesso: true,
            provedor: "PixScan AI",
            dados_extraidos: {
                emissor: { nome_empresa: "Supermercado Exemplo Lda", nif: "5401122334" },
                documento: { tipo: "Factura-Recibo", numero: "FR/2026/001" },
                financeiro: { moeda: "AOA", valor_total: 15500.00 }
            }
        };

        return res.status(200).json(respostaSucesso);

    } catch (error) {
        console.error("Erro no processamento do OCR:", error);
        return res.status(500).json({ 
            erro: "Falha interna ao processar o OCR do recibo angolano." 
        });
    }
});

// Iniciar o servidor na porta injetada automaticamente pela hospedagem (Koyeb/Render)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`PixScan AI rodando com sucesso na porta ${PORT}`);
});
