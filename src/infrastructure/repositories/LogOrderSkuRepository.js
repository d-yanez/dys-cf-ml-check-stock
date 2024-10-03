const LogOrderSkuModel = require('../models/LogOrderSkuModel');  // Modelo de Mongoose

class LogOrderSkuRepository {
    async findBySkuAndOrder(sku, order) {
        console.log(`[findBySkuAndOrder]sku: ${sku} and order ${order} `);
        const log = await LogOrderSkuModel.findOne({ sku, order });
        console.log(log);
        return !!log;
    }

    async saveLog(sku, order) {
        //await LogOrderSkuModel.create({ sku, order });
        // Si no existe, crear una nueva entrada y retornar false
        const newEntry = new LogOrderSkuModel({ sku, order });
        const savedEntry = await newEntry.save();
        
        // Imprimir el ID del objeto guardado
        console.log('id LogOrderSkuModel :', savedEntry._id);
    }
}

module.exports = LogOrderSkuRepository;
