require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
});

const app = express();
const PORT = process.env.PORT || 10000;

// ================================
// CONFIGURAÇÃO DOS PRODUTOS
// ================================

const PRODUTOS = {
    vitalicio: {
        nome: '♾️ Grupo VIP Vitalício',
        preco: 0.01,
        descricao: 'Acesso permanente ao Grupo VIP.'
    },

    mensal: {
        nome: '📅 Grupo VIP Mensal',
        preco: 0.01,
        descricao: 'Acesso ao Grupo VIP durante 30 dias.'
    }
};

// ================================
// SERVIDOR HTTP
// ================================

app.get('/', (req, res) => {
    res.send('🤖 Bot de vendas funcionando!');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});

// ================================
// FUNÇÃO PARA FORMATAR PREÇO
// ================================

function formatarPreco(valor) {
    return valor.toFixed(2).replace('.', ',');
}

// ================================
// /START
// ================================

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const nome = msg.from.first_name || 'cliente';

    await bot.sendMessage(
        chatId,
        `👋 Olá, ${nome}!

🛍️ Bem-vindo à nossa loja.

Escolha uma opção abaixo:`,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🛍️ Ver produtos',
                            callback_data: 'produtos'
                        }
                    ],
                    [
                        {
                            text: '👤 Meu perfil',
                            callback_data: 'perfil'
                        }
                    ],
                    [
                        {
                            text: '🔄 Renovar assinatura',
                            callback_data: 'renovar'
                        }
                    ],
                    [
                        {
                            text: '❓ Ajuda',
                            callback_data: 'ajuda'
                        }
                    ]
                ]
            }
        }
    );
});

// ================================
// BOTÕES
// ================================

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    try {
        await bot.answerCallbackQuery(query.id);

        // ============================
        // PRODUTOS
        // ============================

        if (data === 'produtos') {

            await bot.sendMessage(
                chatId,
                `🛍️ *NOSSOS PRODUTOS*

Escolha uma das opções abaixo:

♾️ *Grupo VIP Vitalício*
💰 R$ ${formatarPreco(PRODUTOS.vitalicio.preco)}
🔓 Acesso permanente

📅 *Grupo VIP Mensal*
💰 R$ ${formatarPreco(PRODUTOS.mensal.preco)}
⏳ Acesso por 30 dias`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '♾️ VIP Vitalício — R$ 0,01',
                                    callback_data: 'produto_vitalicio'
                                }
                            ],
                            [
                                {
                                    text: '📅 VIP Mensal — R$ 0,01',
                                    callback_data: 'produto_mensal'
                                }
                            ],
                            [
                                {
                                    text: '⬅️ Voltar',
                                    callback_data: 'inicio'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // VIP VITALÍCIO
        // ============================

        if (data === 'produto_vitalicio') {

            await bot.sendMessage(
                chatId,
                `♾️ *GRUPO VIP VITALÍCIO*

${PRODUTOS.vitalicio.descricao}

💰 *Valor: R$ ${formatarPreco(PRODUTOS.vitalicio.preco)}*

Após a confirmação do pagamento, o acesso será liberado automaticamente.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '💳 Comprar por R$ 0,01',
                                    callback_data: 'comprar_vitalicio'
                                }
                            ],
                            [
                                {
                                    text: '⬅️ Voltar aos produtos',
                                    callback_data: 'produtos'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // VIP MENSAL
        // ============================

        if (data === 'produto_mensal') {

            await bot.sendMessage(
                chatId,
                `📅 *GRUPO VIP MENSAL*

${PRODUTOS.mensal.descricao}

💰 *Valor: R$ ${formatarPreco(PRODUTOS.mensal.preco)}*

Após a confirmação do pagamento, o acesso será liberado automaticamente por 30 dias.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '💳 Comprar por R$ 0,01',
                                    callback_data: 'comprar_mensal'
                                }
                            ],
                            [
                                {
                                    text: '⬅️ Voltar aos produtos',
                                    callback_data: 'produtos'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // COMPRA VITALÍCIO
        // ============================

        if (data === 'comprar_vitalicio') {

            await bot.sendMessage(
                chatId,
                `💳 *Pagamento*

Produto: ${PRODUTOS.vitalicio.nome}

💰 Valor: *R$ ${formatarPreco(PRODUTOS.vitalicio.preco)}*

⏳ Em breve esta opção irá gerar automaticamente um Pix pela SyncPay.

🧪 Estamos preparando o sistema de pagamento.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '⬅️ Voltar',
                                    callback_data: 'produto_vitalicio'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // COMPRA MENSAL
        // ============================

        if (data === 'comprar_mensal') {

            await bot.sendMessage(
                chatId,
                `💳 *Pagamento*

Produto: ${PRODUTOS.mensal.nome}

💰 Valor: *R$ ${formatarPreco(PRODUTOS.mensal.preco)}*

⏳ Em breve esta opção irá gerar automaticamente um Pix pela SyncPay.

🧪 Estamos preparando o sistema de pagamento.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '⬅️ Voltar',
                                    callback_data: 'produto_mensal'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // PERFIL
        // ============================

        if (data === 'perfil') {

            await bot.sendMessage(
                chatId,
                `👤 *SEU PERFIL*

🆔 ID: \`${chatId}\`

📛 Nome: ${query.from.first_name || 'Não informado'}

🔴 Assinatura: *Nenhuma*

Você ainda não possui uma assinatura ativa.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '🛍️ Ver produtos',
                                    callback_data: 'produtos'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // RENOVAR
        // ============================

        if (data === 'renovar') {

            await bot.sendMessage(
                chatId,
                `🔄 *RENOVAÇÃO*

Você ainda não possui uma assinatura ativa.

Escolha um produto para começar:`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '🛍️ Ver produtos',
                                    callback_data: 'produtos'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // AJUDA
        // ============================

        if (data === 'ajuda') {

            await bot.sendMessage(
                chatId,
                `❓ *AJUDA*

Caso tenha algum problema com uma compra ou assinatura, entre em contato com o suporte.`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '⬅️ Voltar',
                                    callback_data: 'inicio'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

        // ============================
        // INÍCIO
        // ============================

        if (data === 'inicio') {

            await bot.sendMessage(
                chatId,
                `🏠 *MENU PRINCIPAL*

Escolha uma opção:`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '🛍️ Ver produtos',
                                    callback_data: 'produtos'
                                }
                            ],
                            [
                                {
                                    text: '👤 Meu perfil',
                                    callback_data: 'perfil'
                                }
                            ],
                            [
                                {
                                    text: '🔄 Renovar assinatura',
                                    callback_data: 'renovar'
                                }
                            ],
                            [
                                {
                                    text: '❓ Ajuda',
                                    callback_data: 'ajuda'
                                }
                            ]
                        ]
                    }
                }
            );

            return;
        }

    } catch (error) {
        console.error('❌ Erro ao processar botão:', error);
    }
});

// ================================
// ERROS DO BOT
// ================================

bot.on('polling_error', (error) => {
    console.error('❌ Erro no Telegram:', error.message);
});
