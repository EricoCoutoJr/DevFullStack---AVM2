const { Op } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const {checkBody } = require('../services/checkBody')
const { Medicines } = require('../models/medicines')
class MedicinesController {
    async createOneMedicine(request,response){
        try {
            const { 
                created_by,
                warehouse_id,
                medicine,
                lab,
                desc,
                dosage,
                unit,
                type,
                price,
                quantiti
            } = request.body

            const keysAllowed = [
                "created_by",
                "warehouse_id",
                "medicine",
                "lab",
                "desc",
                "dosage",
                "unit",
                "type",
                "price",
                "quantiti"
            ]
            if (checkBody(keysAllowed,request.body)){
                return response.status(400).send({
                    msg: 'Algum campo enviado não é permitido.'
                })
            }

            // Para testar se há o mesmo medicamento igual no estoque
            // Se houver medicamentos iguais com laboratórios diferentes, em depósitos diferentes,
            // e dosagem diferente poderá ser inserido na tabela.
            // Mas se todas as variáveis testadas forem iguais é pq esse medicamento já está cadastrado
            // no depósito.
            // Existem a possibilidade de termos medicamento iguais, no mesmo depósito e do mesmo
            // laboratório mas com dosagem diferentes. Ex.: Paracetamol 500mg e Paracetamol 750mg do mesmo Lab

            const find = await Medicines.findOne({
                where: {
                  warehouse_id: {
                    [Op.eq]: warehouse_id
                  },
                  medicine: {
                    [Op.eq]: medicine.toUpperCase()
                  },
                  lab: {
                    [Op.eq]: lab.toUpperCase()
                  },
                  dosage: {
                    [Op.eq]: dosage
                  }
                }
              });
            if (!find) {
                const data = await Medicines.create({ 
                    created_by,
                    warehouse_id,
                    medicine,
                    lab,
                    desc,
                    dosage,
                    unit,
                    type,
                    price,
                    quantiti,
                },{individualHooks: true})
                
                return response.status(200).send(data)
            } else {
                return response.status(409).send({msg: "Este medicamento já existe neste depósito."})
            }

        } catch (error) {
            const statusCode = error.message.status || 400;
            const message = error.message.msg || error.message;
            
            return response.status(parseInt(statusCode)).send(
                {
                    msg: "Erro enviado do banco de dados",
                    cause: message
                }
            )
        }
    }

    async updateMedicines (request, response){
        try {
            const { 
                desc,
                price,
                quantiti
            } = request.body

            const keysAllowed = [
                "desc",
                "price",
                "quantiti"
            ]
            if (checkBody(keysAllowed,request.body)){
                return response.status(400).send({
                    msg: 'Algum campo enviado não é permitido.'
                })
            }
            const { id } = request.params
            const idtest = parseInt(id)

            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            if (!desc && !price && !quantiti) {
                return response.status(400).send({
                    msg: 'Não há parametros para atualizar o registro.'
                })
            }
            const medicine = await Medicines.findOne({ where: { id }})
            if (!medicine) return response.status(404).send({
                                                            msg: 'Medicamento não encontrado.'
                                                        })
            await Medicines.update(
                { desc, price, quantiti },
                { where: { id } }
            )
            return response.status(200).send(medicine)
        } catch (error) {
            const statusCode = error.message.type || 400;
            const message = error.message.msg || error.message;
            
            return response.status(parseInt(statusCode)).send(
                {
                    msg: "Erro enviado do banco de dados",
                    cause: message
                }
            )
        }
    }

    async listMedicinesByType(request, response){
        try {
            const { type } = request.query
            var data = null
            if (!type) {
                data = await Medicines.findAll()
            } else {
                data = await Medicines.findAll({ where: { type } })
            }
            return response.status(200).send(data)
        } catch (error) {
            return response.status(400).send(
                {
                    msg: "Erro enviado do banco de dados",
                    cause: error.message
                }
            )
        }
    }

    async listMedicineById(request, response){
        try {
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const medicine = await Medicines.findOne({ where: { id }})
            if (!medicine) return response.status(404).send({
                                                            msg: 'Medicamento não encontrado.'
                                                        })
            return response.status(200).send({medicine})
        } catch (error) {
            return response.status(400).send(
                {
                    msg: "Erro enviado do banco de dados",
                    cause: error.message
                }
            )
        }
    }

    async deleteMedicineById(request, response){
        try {
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const medicine = await Medicines.findOne({ where: { id }})
            if (!medicine) return response.status(404).send({
                                                            msg: 'Medicamento não encontrado.'
                                                        })
            await Medicines.destroy({ where: { id }})
            return response.status(204).send()
        } catch (error) {
            return response.status(400).send(
                {
                    msg: "Erro enviado do banco de dados",
                    cause: error.message
                }
            )
        }
    }
};

module.exports =  new MedicinesController()