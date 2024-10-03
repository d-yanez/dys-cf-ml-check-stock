module.exports = {
    getAccessToken: async function() {
        throw new Error('getAccessToken no implementado');
    },
    getOrderById: async function(orderId, token) {
        throw new Error('getOrderById no implementado');
    },
    getItemById: async function(itemId, token) {
        throw new Error('getItemById no implementado');
    },
    getInventoryStock: async function(inventoryId, token) {
        throw new Error('getInventoryStock no implementado');
    }
};
