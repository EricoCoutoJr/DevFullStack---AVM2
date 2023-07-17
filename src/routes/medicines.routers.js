const { Router } = require('express')
const { auth } = require('../middleware/auth')
const { createOneMedicine, updateMedicines, listMedicinesByType, listMedicineById, deleteMedicineById } = require('../controllers/medicines.controller')


class MedicinesRouter{
    routesFromMedicines () {
        const medicinesRoutes  = Router()
        medicinesRoutes.post('/medicines', auth, createOneMedicine)
        medicinesRoutes.put('/medicines/:id', auth, updateMedicines)
        medicinesRoutes.get('/medicines', auth, listMedicinesByType)
        medicinesRoutes.get('/medicines/:id', auth, listMedicineById)
        medicinesRoutes.delete('/medicines/:id', auth, deleteMedicineById)
        return medicinesRoutes
    }
}

module.exports = new MedicinesRouter()