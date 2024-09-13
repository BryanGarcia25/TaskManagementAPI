const mongoose = require('mongoose');

mongoose.connect(
    `mongodb://${process.env.TASK_MANAGEMENT_MONGODB_HOST}/${process.env.TASK_MANAGEMENT_MONGODB_DATABASE}`
).then(() => {
        console.log("MongoDB conectado correctamente");
}).catch(error => {
        console.error(`Error al momento de conectarse con MongoDB: ${error.message}`);
});