'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.createTable('medicines', { 
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
        warehouse_id:{
            //Esta coluna faz relação tem com o depósito onde esta o medicamento
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'warehouses'
                },
                key: 'id'
            }
        },
        medicine: {
          type: Sequelize.STRING,
          allowNull: false
      },
      lab: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      desc: {
          type: Sequelize.STRING,
          allowNull: true
      },
      dosage: {
          type: Sequelize.DECIMAL,
          allowNull: true
      },
      unit: {
          type: Sequelize.ENUM('mg', 'mcg', 'g', 'mL', '%', 'Outros'),
          allowNull: false
      },
      type:{
          type: Sequelize.ENUM('Controlado', 'Não controlado'),
          allowNull: false
      },
      price:{
          type: Sequelize.DECIMAL,
          allowNull: false
      },
      quantiti: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE
    });

  },

  async down (queryInterface, Sequelize) {

      await queryInterface.dropTable('medicines');

  }
};
