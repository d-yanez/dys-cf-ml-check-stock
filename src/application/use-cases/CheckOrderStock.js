module.exports = class CheckOrderStock {
    constructor(logOrderSkuRepository, mercadoLibreService, metaMessageService) {
        this.logOrderSkuRepository = logOrderSkuRepository;
        this.mercadoLibreService = mercadoLibreService;
        this.metaMessageService = metaMessageService;
    }

    async execute(orderEvent) {
        const { orderId } = orderEvent;
        console.log(`CheckOrderStock.execute ${orderId}`);
        const token = await this.mercadoLibreService.getAccessToken();
        const order = await this.mercadoLibreService.getOrderById(orderId, token);

        for (const orderItem of order.order_items) {
            const item = orderItem.item;
            console.log(`ID: ${item.id}, Título: ${item.title}`);
            const itemInfo = await this.mercadoLibreService.getItemById(item.id, token);
            const availableQuantity = itemInfo.available_quantity;
            console.log(`availableQuantity: ${availableQuantity} for item: ${item.id}`);
            if (availableQuantity === 0) {
                const alreadyLogged = await this.logOrderSkuRepository.findBySkuAndOrder(item.id, orderId);
                if (!alreadyLogged) {
                    console.log(`[inventory]save sku: ${item.id} and order ${orderId} in log! and notify message`);
                    await this.logOrderSkuRepository.saveLog(item.id, orderId);
                    // Notificar stock out a Meta Message
                    await this.metaMessageService.sendStockOutMessage(item.id, orderId); // Notificar a Meta
                }
                else{
                    console.log("[inventory]Order already notified!!")
                }
            } else{ 
                // Verificar si el campo shipping y logistic_type existen antes de acceder
                const logisticType = item.shipping?.logistic_type;
                if (logisticType === 'fulfillment') {
                    const inventoryId = item.inventory_id || (item.variations || []).find(variation => variation.inventory_id)?.inventory_id;
                    console.log(`inventoryId: ${inventoryId}`);
                    if (inventoryId) {
                        const warehouseStock = await this.mercadoLibreService.getInventoryStock(inventoryId, token);
                        console.log(`warehouseStock: ${warehouseStock}`);
                        if (warehouseStock === 0) {
                            const alreadyLogged = await this.logOrderSkuRepository.findBySkuAndOrder(item.id, orderId);
                            if (!alreadyLogged) {
                                console.log(`[In FULL]save sku: ${item.id} and order ${orderId} in log! and notify message`);
                                await this.logOrderSkuRepository.saveLog(item.id, orderId);
                                // Notificar stock out a Meta Message
                                await this.metaMessageService.sendStockOutMessage(item.id, orderId); // Notificar a Meta
                            }
                            else{
                                console.log("[In FULL]Order already notified!!")
                            }
                        }
                    }
                }
                else {
                    console.log("Sku not in FULL")
                }
        }
        }
    }
};
