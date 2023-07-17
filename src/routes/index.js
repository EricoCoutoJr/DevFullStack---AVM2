//Neste arquivo enpacotamos todas as rotas em uma variável que será disponibilizada pelo server.js
// Instaciando a variável routes com a função express.Router()
const { Router } = require('express')
const { routesFromUser } = require('./users.routers')
const { routesFromWarehouse } = require('./warehouses.routers')
const { routesFromMedicines} = require('./medicines.routers')

const routes = new Router()


// Definindo uma das rotas
// A função de cada rota está disponível na pasta controllers - local das regras de negócio
// routes.verbo_http('/rota/usada', função a ser executada)
// Para chamar esta rota devemos usar o params body

// Este arquivo pode ser fragmentado em 4 grupos de rotas

// Routers para categories

routes.use('/api', [
  routesFromUser(),
  routesFromWarehouse(),
  routesFromMedicines()
])

// Exportação do objeto routes para uso no server.js
module.exports = routes