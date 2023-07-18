const { STRING, DATE, INTEGER, FLOAT, DataTypes } = require('sequelize')
const { connection } = require('../database/connection')


const Warehouses = connection.define("warehouses", {
    created_by:{
        //Esta coluna faz relação tem com o usuário que criou o medicamento
        type: INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: {
                tableName: 'users'
            },
            key: 'id'
        },
        validate: {
            notNull: {
              msg: 'O created_by é obrigatório.' // Mensagem de erro personalizada
        }
        }
    },
    razaosocial: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'A Razão Social é obrigatório.' // Mensagem de erro personalizada
        }},
        unique: { msg: {"msg": "Razão Social já cadastrada.", "status": "409"}},
        get() {
            const rawValue = this.getDataValue('razaosocial');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    nomefantasia: {
            type: STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'O Nome Fantasia é obrigatório.' // Mensagem de erro personalizada
            }},
            get() {
                const rawValue = this.getDataValue('nomefantasia');
                return rawValue ? rawValue.toUpperCase() : null;
              }
    },
    cnpj: {
        type: STRING,
        validate: {   
          len: {
            args: [14, 14],
            msg: "Este campo deve ter exatamente 14 caracteres.",
            notNull: { msg: 'O CNPJ é obrigatório' }
          }
        },
        unique: { msg: {"msg": "CNPJ já cadastrada.", "status": "409"}},
        allowNull: false
    },
    email: {
        type: STRING,
        allowNull: false,
        validate:{
            isEmail: {msg: "Email Invalido"},
            notNull: { msg: "O email é obrigatório."}
        },
        unique: { msg: {"msg": "Email já cadastrado.", "status": "409"}},
        get() {
            const rawValue = this.getDataValue('email');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    fone: {
        type: STRING,
        allowNull: true
    },
    cellfone: {
        type: STRING,
        allowNull: true
    },
    cep: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O CEP é obrigatório.' // Mensagem de erro personalizada
        }}
    },
    street:{
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O nome da rua é obrigatório.' // Mensagem de erro personalizada
        }},
        get() {
            const rawValue = this.getDataValue('street');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    num:{
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O numero da unidade é obrigatório.' // Mensagem de erro personalizada
        }}
    },
    neighborhood: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O nome doo bairro é obrigatório.' // Mensagem de erro personalizada
        }},
        get() {
            const rawValue = this.getDataValue('neighborhood');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    city: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O nome da cidade é obrigatório.' // Mensagem de erro personalizada
        }},
        get() {
            const rawValue = this.getDataValue('city');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    state: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O Estado é obrigatório.' // Mensagem de erro personalizada
        }},
        get() {
            const rawValue = this.getDataValue('state');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    complement: {
        type: STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('complement');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    lat: {        
        type: FLOAT,
        allowNull: false,
        validate: {
            min: { 
                args: -90,
                msg: ' O valor mínimo para latitude é -90'
            },
            max: {
                args:90,
                msg: 'O valor máximo para latitude é 90'    
            },
            notNull: {
              msg: 'A latitude é obrigatória.' // Mensagem de erro personalizada
        }}
    },
    lng:{
        type: FLOAT,
        allowNull: false,
        validate: {
            min: { 
                args: -180,
                msg: ' O valor mínimo para longitude é -180'
            },
            max: {
                args:180,
                msg: 'O valor máximo para longitude é 190'    
            },
            notNull: {
              msg: 'O created_by é obrigatório.' // Mensagem de erro personalizada
        }}
    },
    status:{
        // Neste campo da tabela o item status as opções estão limitadas entre Ativo e Inativo
        // e por defaut assumirá como Ativo
        type: DataTypes.ENUM('ATIVO', 'INATIVO'),
        defaultValue: 'ATIVO',
        allowNull: false
    },
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
},
{ underscored: true, paranoid: true })

Warehouses.associate = (models) => {
    // Pertence a User id - ( 1 User do Users)
    Warehouses.belongsTo(models.Users, {
      foreignKey: 'created_id',
      allowNull: false
    });
    // Tem muitos medicamentos warehouse_id - ( Warehouses )
    Warehouses.hasMany(models.Medicines, {
      foreignKey: 'warehouse_id',
      allowNull: false,
    });
  };


module.exports = { Warehouses }