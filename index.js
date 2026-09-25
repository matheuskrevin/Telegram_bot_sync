require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: true
});

console.log('🤖 Bot de vendas iniciado!');

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
        chatId,
        `👋 Olá, ${msg.from.first_name}!

Bem-vindo à nossa loja.

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

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    await bot.answerCallbackQuery(query.id);

    if (data === 'produtos') {
        await bot.sendMessage(
            chatId,
            `🛍️ Nossos produtos:

♾️ Grupo VIP Vitalício
💰 Preço: em breve

📅 Grupo VIP Mensal
💰 Preço: em breve`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '♾️ VIP Vitalício',
                                callback_data: 'produto_vitalicio'
                            }
                        ],
                        [
                            {
                                text: '📅 VIP Mensal',
                                callback_data: 'produto_mensal'
                            }
                        ]
                    ]
                }
            }
        );
    }

    if (data === 'perfil') {
        await bot.sendMessage(
            chatId,
            `👤 Seu perfil

🆔 ID: ${chatId}

🔴 Você ainda não possui uma assinatura ativa.`,
            {
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
    }

    if (data === 'renovar') {
        await bot.sendMessage(
            chatId,
            '🔄 Você não possui uma assinatura ativa para renovar.'
        );
    }

    if (data === 'ajuda') {
        await bot.sendMessage(
            chatId,
            `❓ Ajuda

Caso tenha algum problema com sua compra, entre em contato com o suporte.`
        );
    }

    if (data === 'produto_vitalicio') {
        await bot.sendMessage(
            chatId,
            `♾️ Grupo VIP Vitalício

Acesso permanente ao grupo.

💰 Preço: R$ XX,XX`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '💳 Comprar',
                                callback_data: 'comprar_vitalicio'
                            }
                        ]
                    ]
                }
            }
        );
    }

    if (data === 'produto_mensal') {
        await bot.sendMessage(
            chatId,
            `📅 Grupo VIP Mensal

Acesso durante 30 dias.

💰 Preço: R$ XX,XX`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '💳 Comprar',
                                callback_data: 'comprar_mensal'
                            }
                        ]
                    ]
                }
            }
        );
    }
});
const express = require('express');

const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('Bot de vendas funcionando!');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor HTTP rodando na porta ${PORT}`);
});
