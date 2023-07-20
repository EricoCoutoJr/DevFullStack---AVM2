const { Op } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const { Warehouses } = require('../models/warehouses')
const { checkBody } = require('../services/checkBody')

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
            const keysAllowed = [                    
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
                lng]
            if (checkBody(keysAllowed,request.body)){
                return response.status(400).send({
                    msg: 'Algum campo enviado não é permitido.'
                })
            }
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
            const keysAllowed = ['nomefantasia',
                'email',
                'fone',
                'celfone',
                'cep',
                'street',
                'num',
                'neighborhood',
                'city',
                'state',
                'complement',
                'lat',
                'lng'];
            if (checkBody(keysAllowed,request.body)){
                return response.status(400).send({
                    msg: 'Algum campo enviado não é permitido atualizar.'
                })
            }

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
            const status = ( warehouse.status === "Ativo" ) ? 'Inativo' : 'Ativo'
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
            const warehouse = await Warehouses.findByPk(id)
        
            if (!warehouse) {
                return response.status(404).send({msg:'Depósito não encontrado.'});
            }
            // As regras que impedem a deleção estão no hook no arquivo warehouses models
            // É necessário informar que tem um hook a ser usado no model
            const data = await Warehouses.destroy({where:{id}, individualHooks: true})

            return response.status(204).send(data)
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

module.exports =  new WarehousesController()