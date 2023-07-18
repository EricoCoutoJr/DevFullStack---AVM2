'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('warehouses', { 
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        created_by:{
            //Esta coluna faz relação tem com o usuário que criou o medicamento
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'users'
                },
                key: 'id'
            }
        },
        razaosocial: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
        },
        nomefantasia: {
                type: Sequelize.STRING,
                allowNull: false,
        },
        cnpj: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        fone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cellfone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cep: {
            type: Sequelize.STRING,
            allowNull: false
        },
        street:{
            type: Sequelize.STRING,
            allowNull: false
        },
        num:{
            type: Sequelize.STRING,
            allowNull: false
        },
        neighborhood: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        complement: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lat: {        
            type: Sequelize.FLOAT,
            allowNull: false
        },
        lng:{
            type: Sequelize.FLOAT,
            allowNull: false
        },
        status:{
            // Neste campo da tabela o item status as opções estão limitadas entre Ativo e Inativo
            // e por defaut assumirá como Ativo
            type: Sequelize.ENUM('ATIVO', 'INATIVO'),
            defaultValue: 'ATIVO',
            allowNull: false
        },
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        deleted_at: Sequelize.DATE
        });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('warehouse');

  }
};
