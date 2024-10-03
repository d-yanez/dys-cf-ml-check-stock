const axios = require('axios');

class MercadoLibreService {
    async getAccessToken() {
        console.log("ML.getAccessToken");
        const response = await axios.post('https://us-central1-prd-dyshopnow.cloudfunctions.net/dys-cf-api-ml-auth/auth/token', null, {
            headers: { 'x-api-key': process.env.ML_API_KEY }
        });
        console.log(`token ML:${response.data.token}`);
        return response.data.token;
    }

    async getOrderById(orderId, token) {
        console.log("ML.getOrderById");
        const response = await axios.get(`https://api.mercadolibre.com/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async getItemById(itemId, token) {
        console.log("ML.getItemById");
        const response = await axios.get(`https://api.mercadolibre.com/items/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async getInventoryStock(inventoryId, token) {
        console.log("ML.getInventoryStock");
        const response = await axios.get(`https://api.mercadolibre.com/inventories/${inventoryId}/stock/fulfillment`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.available_quantity;
    }
}

module.exports = MercadoLibreService;
