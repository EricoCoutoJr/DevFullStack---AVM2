const express = require('express') 
const cors = require('cors') 
const { connection } = require('./database/connection')
const routes = require('./routes')

class Server {
// Execuções ao processar as ações do servidor
// Todas as funções que estiverem no constructor serão executadas assincronamente
  constructor (server = express())
  { 
    this.middlewares(server) 
    this.database()  
    this.allRoutes(server)
    this.initializeServer(server) 
  }

  async middlewares(app) {
    app.use(cors()) 
    app.use(express.json())
  }

  // Conexão com o banco de dados
  async database() {
    try {
      await connection.authenticate(); 
      console.log('Conexão bem sucedida!');
    } catch (error) {
      console.error('Não foi possível conectar no banco de dados.', error);
      throw error
    }
  }
  
  async initializeServer(app) {
    const PORT = 3333 // Valor da porta do servidor do APP
    app.listen(PORT, () => console.log(`Servidor executando na porta ${PORT}`))
  }

  async allRoutes(app) {
    app.use(routes)
  }
}

module.exports = { Server }