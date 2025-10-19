

'use strict';

const axios = require('axios');

/**
 * TelegramMessageService
 * Servicio delgado para enviar mensajes a Telegram usando Bot API.
 *
 * Requiere:
 *  - TELEGRAM_BOT_TOKEN (env)
 *  - TELEGRAM_CHAT_ID   (env)
 */
class TelegramMessageService {
  /**
   * @param {{ botToken?: string, chatId?: string|number, parseMode?: 'Markdown'|'HTML' }} options
   */
  constructor(options = {}) {
    this.botToken = options.botToken || process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = options.chatId || process.env.TELEGRAM_CHAT_ID;
    this.parseMode = options.parseMode || 'Markdown'; // Usar 'Markdown' para evitar escapes complejos de MarkdownV2

    if (!this.botToken) {
      console.warn('[Telegram] Aviso: falta TELEGRAM_BOT_TOKEN');
    }
    if (!this.chatId) {
      console.warn('[Telegram] Aviso: falta TELEGRAM_CHAT_ID');
    }

    // Base para ver stock (permite override por env si cambia la URL)
    //this.stockViewBase = process.env.STOCK_VIEW_BASE_URL || 'https://railway-node-express-app.up.railway.app/views?sku=';
    this.stockViewBase = 'https://dy-api-utils-785293986978.us-central1.run.app/stock/view/';

    this.http = axios.create({
      baseURL: `https://api.telegram.org/bot${this.botToken}`,
      timeout: 15000,
    });
  }

  /** Envía un mensaje arbitrario de texto al chat configurado */
  async sendMessage(text, opts = {}) {
    if (!this.botToken || !this.chatId) {
      console.error('[Telegram] Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID');
      return { ok: false };
    }

    const payload = {
      chat_id: opts.chatId || this.chatId,
      text,
      parse_mode: opts.parseMode || this.parseMode,
      disable_web_page_preview: opts.disablePreview ?? true,
    };

    try {
      const res = await this.http.post('/sendMessage', payload);
      console.log('[Telegram] STATUS:', res.status);
      // No logueamos todo el body para no saturar logs; dejarlo bajo nivel cuando se requiera
      console.log('[Telegram] MESSAGE_ID:', res?.data?.result?.message_id);
      return { ok: true, providerId: res?.data?.result?.message_id, meta: res.data };
    } catch (err) {
      const status = err?.response?.status;
      const body = err?.response?.data || err?.message;
      console.error('[Telegram] ERROR:', status, JSON.stringify(body));
      return { ok: false };
    }
  }

  /**
   * Envía alerta de stock-out con SKU, Orden y link para ver stock actual.
   * @param {string} skuRaw  - SKU de ML (puede venir como MLC123456)
   * @param {string|number} orderId
   * @param {object} [extra] - Campos extra que quieras incluir en texto/logs
   */
  async sendStockOutMessage(skuRaw, orderId, extra = undefined) {
    const skuForLink = (typeof skuRaw === 'string' && skuRaw.startsWith('MLC')) ? skuRaw.slice(3) : skuRaw;
    const stockUrl = `${this.stockViewBase}${skuForLink}`;

    // Construcción del mensaje (Markdown simple)
    let text = '';
    text += '🚨 *STOCK OUT*\n';
    text += `• SKU: \`${skuRaw}\`\n`;
    text += `• Orden: \`${orderId}\`\n`;
    text += `• Ver stock: ${stockUrl}`;

    if (extra && Object.keys(extra).length) {
      try {
        const trimmed = JSON.stringify(extra);
        // Evitar mensajes gigantes; Telegram limita tamaño
        text += `\n• Extra: \`${trimmed.slice(0, 800)}\``;
      } catch (_) {
        // no-op si no serializa
      }
    }

    return this.sendMessage(text);
  }
}

module.exports = TelegramMessageService;