const CheckOrderStock = require('../../application/use-cases/CheckOrderStock');
const LogOrderSkuRepository = require('../../infrastructure/repositories/LogOrderSkuRepository');
const MercadoLibreService = require('../../infrastructure/services/MercadoLibreService');
const MetaMessage = require('../../infrastructure/services/MetaMessage');
const TelegramMessageService = require('../../infrastructure/services/TelegramMessageService');

module.exports = async function(req, res) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ success: false, message: 'Api key no válida' });
    }
    console.log("response 200")
    res.status(200).send('OK');  // Respuesta inmediata

    setImmediate(async () => {
        try {
            const orderEvent = req.body;
            console.log("OrderController - setImmediate")
            console.log(orderEvent)
            const logOrderSkuRepository = new LogOrderSkuRepository();
            const mercadoLibreService = new MercadoLibreService();
            const metaMessageService = new MetaMessage(process.env.META_PHONE_NUMBER_ID, process.env.META_ACCESS_TOKEN, process.env.TO_PHONE_NUMBER);
            const telegramMessageService = new TelegramMessageService({
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID,
            });
            const checkOrderStock = new CheckOrderStock(logOrderSkuRepository, mercadoLibreService, metaMessageService,telegramMessageService);
            await checkOrderStock.execute(orderEvent);
        } catch (error) {
            console.error('Error procesando la orden:', error);
        }
    });
};
