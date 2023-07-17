const { sign } = require('jsonwebtoken');
const { Op } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const { Users  } = require('../models/users')

class UsersController{
    async createOneUser(request, response){

        try {
            const {
                name,
                lastname,
                geneder,
                birthdate,
                cpf,
                fone,
                email,
                password
            } = request.body;
          
            const data = await Users.create({
                name,
                lastname,
                geneder,
                birthdate,
                cpf,
                fone,
                email,
                password
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

    async loginUser(request, response) {
        const {
            email,
            password
        } = request.body;
        if (!email || !password) {
            return response.status(400).send({ msg: "Todos os campos senha e email devem ser fornecidos." });
          } else {
            console.log('Request.body com dados completo.')
          }
        try {              
                const user = await Users.findOne({
                    where:{email:email}})
                    
                if (!user) {
                    return response.status(404).send({"msg": "Usuário não encontrado."})
                }
                if(user.status === 'Inativo'){
                    return response.status(401).send({"msg": "Usuário inativo"})
                }
                if (user.password === password){
                    const payload = {"email": user.email, "id":user.id}
                    const token = sign(payload, process.env.JWT_SECRET_KEY, {
                        expiresIn: "1d"
                    })         
                    return response.status(200).send({"token": token}) 
                }
                else {
                    return response.status(401).send({"msg": "Senha Invalida"})
                }
            } catch (error) {
                return response.status(400).send({
                    msg: "Erro enviado do banco de dados",
                    error: error.message
                })
            }
    }

    async updateUser(request, response) {
        try {
            const {
                name,
                lastname,
                gender,
                fone,
            } = request.body;
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            if (!name && !lastname && !gender && !fone) {
                return response.status(400).send({
                    msg: 'Não há parametros para atualizar o registro.'
                })
            }
            const user = await Users.findOne({ where: { id }})
            if (!user) return response.status(404).send({
                                                            msg: 'Usuário não encontrado.'
                                                        })
            await Users.update(
                { name, lastname, gender, fone },
                { where: { id } }
            )
            return response.status(204).send()
        } catch (error) {
            return response.status(401).send({
                msg: "Erro enviado do banco de dados",
                error: error.message
            })
        }
    }

    async updateUserState(request, response){
        try {
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const user = await Users.findOne({ where: { id }})
            if (!user) return response.status(404).send({
                                                            msg: 'Usuário não encontrado.'
                                                        })
            const status = ( user.status === "Ativo" ) ? 'Inativo' : 'Ativo'
            await Users.update(
                { status },
                { where: { id } }
            )
            return response.status(200).send("updateUserState...")
        } catch (error) {
            return response.status(401).send({
                msg: "Erro enviado do banco de dados",
                error: error.message
            })
        }
    }

    async changePassword(request,response){
        try {
            const { password } = request.body
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const user = await Users.findOne({ where: { id }})
            if (!user) return response.status(404).send({
                                                            msg: 'Usuário não encontrado.'
                                                        })
            if (!password) {
                return response.status(400).send({
                    msg: 'Não há parametros para atualizar o registro.'
                })
            }
            await Users.update(
                { password },
                { where: { id } }
            )
            return response.status(204).send()
        }catch (error) {
            return response.status(401).send({
                msg: "Erro enviado do banco de dados",
                error: error.message
            })
        }
    }

    async listUser(request,response){
        try {
            const { id } = request.params
            const idtest = parseInt(id)
            if ( idtest <= 0 || isNaN(idtest) ){
                return response.status(400).send({
                    msg: 'Valor do id tem que ser numérico e positivo.'
                })
            }
            const user = await Users.findOne({ where: { id }})
            if (!user) return response.status(404).send({
                                                            msg: 'Usuário não encontrado.'
                                                        })
            return response.status(200).send({user})
        } catch (error) {
            return response.status(401).send({
                msg: "Erro enviado do banco de dados",
                error: error.message
            })
        }

    }
}

module.exports = new UsersController()