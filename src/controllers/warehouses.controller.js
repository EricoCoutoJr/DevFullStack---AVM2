const { Op } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const { Warehouses } = require('../models/warehouses')
const { Medicines } = require('../models/medicines')

class WarehousesController {
    async createOneWarehouse(request,response){
        try {
            const {
                    created_by,
                    razaosocial,
                    nomefantasia,
                    cnpj,
                    email,
                    fone,
                    cellfone,
                    cep,
                    street,
                    num,
                    neighborhood,
                    city,
                    state,
                    complement,
                    lat,
                    lng
            } = request.body
            
            const data = await Warehouses.create({
                created_by,
                razaosocial,
                nomefantasia,
                cnpj,
                email,
                fone,
                cellfone,
                cep,
                street,
                num,
                neighborhood,
                city,
                state,
                complement,
                lat,
                lng
        })
            return response.status(201).send(data)
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

    async updateWarehouse (request, response){
        try {
            const { id } = request.params
            const {
                nomefantasia,
                email,
                fone,
                celfone,
                cep,
                street,
                num,
                neighborhood,
                city,
                state,
                complement,
                lat,
                lng
            } = request.body
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const warehouse = await Warehouses.findOne({ where: { id }})
            if (!warehouse)
                return response.status(404).send({
                    msg: 'Depósito não encontrado.'
                })
            if (!warehouse.status === 'Inativo') 
                return response.status(401).send({
                    msg: 'Depósito Intivo. Atualizações só podem ser feitas em depósitos Ativos'
                })

            await Warehouses.update(
                    {   nomefantasia,
                        email,
                        fone,
                        celfone,
                        cep,
                        street,
                        num,
                        neighborhood,
                        city,
                        state,
                        complement,
                        lat,
                        lng },
                    { where: { id } }
                )
            return response.status(204).send()
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

    async statusUpdateWarehouse(request, response){
        // Para Melhorar essa função seria necessário verificar se há medicamento 
        // no depósito antes de inativá-lo, mas isso não faz parte da regra de negócio.
        try {
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const warehouse = await Warehouses.findOne({ where: { id }})
            if (!warehouse) return response.status(404).send({
                                                            msg: 'Depósito não encontrado.'
                                                        })
            const status = ( warehouse.status === "ATIVO" ) ? 'INATIVO' : 'ATIVO'
            await Warehouses.update(
                { status },
                { where: { id } }
            )
            return response.status(204).send('Status atualizado para '+ status)
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

    async listWarehouserByStatus(request, response){
        try {
            const { status } = request.query
            var data = null
            console.log(status)
            if (!status) {
                data = await Warehouses.findAll()
            } else {
                data = await Warehouses.findAll(
                                    { where: { status } }
                                   )
                                }
            return response.status(200).send(data)
            
            

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

    async listWarehouseById(request, response){
        try {
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const warehouse = await Warehouses.findOne({ where: { id }})
            if (!warehouse) return response.status(404).send({
                                                            msg: 'Depósito não encontrado.'
                                                        })
            return response.status(200).send({warehouse})
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

    async deleteWarehouseById(request, response){
        try {
            const { id } = request.params
            const warehouse = await Warehouses.findByPk(id, {
                include: {
                    model: Medicines,
                    attributes: ['id'], // Lista dos IDs dos medicamentos
                    required: false // Define que a associação não é obrigatória
                }
            });
        
            if (warehouse) {
                if (warehouse.Medicines.length > 0){// Retorna true se existem medicamentos, false caso contrário
                    return response.status(401).send({msg:'Tem medicamento no depósito'})
                };
                if (warehouse.status === "Ativo"){
                    return response.status(401).send({msg: 'Depósito ainda está ativo.'})
                }
            } else {
                return response.status(404).send({msg:'Depósito não encontrado.'});
            }
            // Colocar aqui do const data = Warehouse.distroy(whare:{id})
            return response.status(204).send('Depósito removido.')
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
};

module.exports =  new WarehousesController()