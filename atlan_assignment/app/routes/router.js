module.exports = (app) => {
    const controller = require('../controller/controller.js');
    app.all("/api/v1/upload", controller.upload_func);
    app.all("/api/v1/export", controller.export_func);
    app.all("/api/v1/createteam", controller.createteam_func);

}