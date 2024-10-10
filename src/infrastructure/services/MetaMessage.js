const axios = require('axios');

const templateName = 'out_stock_tmp'; // Nombre de la plantilla aprobada
module.exports = class MetaMessage {
    constructor(metaPhoneNumberId, metaAccessToken, toPhoneNumber) {
        this.metaPhoneNumberId = metaPhoneNumberId;
        this.metaAccessToken = metaAccessToken;
        this.toPhoneNumber = toPhoneNumber;
    }

    async sendStockOutMessage(skuML, orderId) {
        //const message = `Stock out para el SKU: ${sku} en la orden ${orderId}`;
        let sku = skuML.slice(3);
        let message = `https://railway-node-express-app.up.railway.app/views?sku=${sku}`
        console.log('[MetaMessage] - sendStockOutMessage');
        //console.log(`[MetaMessage] - recipientPhone: ${WHATSAPP_RECIPIENT_PHONE}`);
        const data = {
            messaging_product: 'whatsapp',
            to: process.env.WHATSAPP_RECIPIENT_PHONE, // Teléfono del destinatario
            type: 'template',
            template: {
                name: templateName,
                language: {
                  code: 'en'
                },
                components:[
                  {
                    type:'body',
                    parameters: [
                      {
                        type: 'text',
                        text: `${message}`
                      }
                    ]
                  }
                ]
            }
        };

        try {
          //this.metaPhoneNumberId

          //console.log(`this.metaPhoneNumberId: ${this.metaPhoneNumberId}`);
          //console.log(`this.metaAccessToken: ${this.metaAccessToken}`);
          console.log(`this.toPhoneNumber: ${this.toPhoneNumber}`);
          const response = await axios.post(
            `https://graph.facebook.com/v20.0/${this.metaPhoneNumberId}/messages`,
            {
              messaging_product: 'whatsapp',
              to: this.toPhoneNumber,
              type: 'template',
              template: {
                name: templateName,
                language: {
                  code: 'en'
                },
                components:[
                  {
                    type:'body',
                    parameters: [
                      {
                        type: 'text',
                        text: `${message}`
                      }
                    ]
                  }
                ]
              }
            },
            {
              headers: {
                Authorization: `Bearer ${this.metaAccessToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
      
          console.log('Mensaje enviado:', response.data);
          console.log(`Mensaje enviado a WhatsApp sobre stock out de SKU: ${sku}`);
        } catch (error) {
            console.error('Error al enviar el mensaje de stock out:', error.response ? error.response.data : error.message);
            throw new Error('No se pudo enviar el mensaje de stock out');
        }
    }
};
