const { Router } = require('express')
const { auth } = require('../middleware/auth')
const { createOneWarehouse, updateWarehouse, statusUpdateWarehouse, listWarehouserByStatus, listWarehouseById, deleteWarehouseById } = require('../controllers/warehouses.controller')


class WarehousesRouter{
    routesFromWarehouse () {
        const warehousesRoutes  = Router()
        warehousesRoutes.post('/warehouses', auth, createOneWarehouse)
        warehousesRoutes.patch('/warehouses/:id', auth, updateWarehouse)
        warehousesRoutes.patch('/warehouses/:id/status', auth, statusUpdateWarehouse )
        warehousesRoutes.get("/warehouses", auth, listWarehouserByStatus)
        warehousesRoutes.get("/warehouses/:id", auth, listWarehouseById)
        warehousesRoutes.delete('/warehouses/:id', auth, deleteWarehouseById)
        return warehousesRoutes
    }
}

module.exports = new WarehousesRouter()