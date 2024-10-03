const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        /*await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // 20 segundos en lugar de 10
        });*/
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

mongoose.connection.on('connected', () => {
console.log('Conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
console.error('Error en la conexión a MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
console.log('Desconectado de MongoDB');
});
mongoose.set('bufferCommands', false);

module.exports = connectDB;
