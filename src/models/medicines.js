const { STRING, DATE, INTEGER, DataTypes, DECIMAL } = require('sequelize')
const { connection } = require('../database/connection')

const Medicines = connection.define("medicines", {
    created_by:{
        //Esta coluna faz relação com o usuário que criou o medicamento
        type: INTEGER,
        allowNull: false,
        references: {
            model: {
                tableName: 'users'
            },
            key: 'id'
        },
        validate: {
            notNull: {msg: "O campo created_by é obrigatório."}
        }
    },
    warehouse_id:{
        //Esta coluna faz relação com o depósito onde está o medicamento guardado
        type: INTEGER,
        allowNull: false,
        references: {
            model: {
                tableName: 'warehouses'
            },
            key: 'id'
        },
        validate: {
            notNull: {msg: "O campo warehouse_id é obrigatório."}
        }
    },
    medicine: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "O campo medicine é obrigatório."}
        }
    },
    lab: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {msg: "O campo lab é obrigatório."}
        }
    },
    desc: {
        type: STRING,
        allowNull: true,
    },
    dosage: {
        type: DECIMAL,
        allowNull: false,
        validate: {
            notNull: {msg: "O campo lab é obrigatório."}
        }
    },
    unit: {
        type: DataTypes.ENUM('mg', 'mcg', 'g', 'mL', '%', 'Outros'),
        allowNull: false,
        validate: {
            notNull: {
              msg: 'A unidade de medida do produto é obrigatória.'
            },
            isIn: {
              args: [['mg', 'mcg', 'g', 'mL', '%', 'Outros']],
              msg: 'A unidade de medida informada é inválida.'
            }
        }
    },
    type:{
        type: DataTypes.ENUM('Controlado', 'Não controlado'),
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O campo type é obrigatória.'
            },
            isIn: {
              args: [['Controlado', 'Não controlado']],
              msg: 'O campo type só pode receber os seguintes valores: Controlado, Não controlado'
            }
        }
    },
    price:{
        type: DECIMAL,
        allowNull: false,
        validate: {
            min: { 
                args: 0.01,
                msg: ' O valor mínimo para a coluna price é 0,01'
            },
            notNull: {
              msg: 'A coluna price é obrigatório.' 
        }}
    },
    quantiti: {
        type: INTEGER,
        allowNull: false,
        validate: {
            min: { 
                args: 0.01,
                msg: ' O valor mínimo para a coluna price é 0,01'
            },
            notNull: {
              msg: 'A coluna price é obrigatório.' 
        }}
    },
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
},
{ underscored: true, paranoid: true });

Medicines.associate = (models) => {
    // Pertende a um usuário ( User )
    Medicines.belongsTo(models.Users, {
      foreignKey: 'created_by',
      allowNull: false
    });
    // Pertence a um depósito ( Warehouse )
    Medicines.belongsTo(models.Warehouses, {
      foreignKey: 'warehouse_id',
      allowNull: false
    });
  };



module.exports = { Medicines }