const { STRING, DATE, INTEGER, FLOAT, DataTypes } = require('sequelize')
const { connection } = require('../database/connection')
const { Medicines } = require('./medicines')
const { Users } = require('./users')



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
        },
      },
        unique: { msg: {"msg": "Razão Social já cadastrada.", "status": "409"}},
        get() {
          return this.getDataValue('razaosocial');
        },
        set(value) {
          if (value) {
              this.setDataValue('razaosocial', value.toUpperCase());
          }
      },
    },
    nomefantasia: {
            type: STRING,
            allowNull: false,
            validate: {
                notNull: {
                  msg: 'O Nome Fantasia é obrigatório.' // Mensagem de erro personalizada
            }},
            get() {
              return this.getDataValue('nomefantasia');
            },
            set(value) {
              if (value) {
                  this.setDataValue('nomefantasia', value.toUpperCase());
              }
          },
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
          return this.getDataValue('email');
        },
        set(value) {
          if (value) {
              this.setDataValue('email', value.toLowerCase());
          }
      },
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
          return this.getDataValue('street');
        },
        set(value) {
          if (value) {
              this.setDataValue('street', value.toUpperCase());
          }
      },
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
          return this.getDataValue('neighborhood');
        },
        set(value) {
          if (value) {
              this.setDataValue('neighborhood', value.toUpperCase());
          }
      },
    },
    city: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O nome da cidade é obrigatório.' // Mensagem de erro personalizada
        }},
        get() {
          return this.getDataValue('city');
        },
        set(value) {
          if (value) {
              this.setDataValue('city', value.toUpperCase());
          }
      },
    },
    state: {
        type: STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'O Estado é obrigatório.' // Mensagem de erro personalizada
        }},
        get() {
          return this.getDataValue('state');
        },
        set(value) {
          if (value) {
              this.setDataValue('state', value.toUpperCase());
          }
      },
    },
    complement: {
        type: STRING,
        allowNull: true,
        get() {
          return this.getDataValue('complement');
        },
        set(value) {
          if (value) {
              this.setDataValue('complement', value.toUpperCase());
          }
      },
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
        type: DataTypes.ENUM('Ativo', 'Inativo'),
        defaultValue: 'Ativo',
        allowNull: false
    },
    createdAt: DATE,
    updatedAt: DATE,
    deletedAt: DATE
},
{ underscored: true, paranoid: true })

Warehouses.beforeDestroy(async (warehouses, options) => {
    // Consulta para verificar se há medicines associadas a esse warehouse
    const medicines = await Medicines.findOne({ where: { warehouse_id: warehouses.id } });
  
    if (medicines) {
      throw new Error('Não é possível excluir o depósito, pois existem medicamentos associadas a ele.');
    }
    // Consultar para ver se o depósito está ativo
    if (warehouses.status === 'Ativo') {
        throw new Error('Não é possível excluir um depósito com status ATIVO.');
      }
  });

Warehouses.beforeCreate(async (warehouses, options) =>{
  const user = await Users.findByPk(warehouses.created_by)
  if (!user){
    throw new Error('Não é possível incluir o depósito, pois o usuário definido no created_by não existe.');
  }
});

Warehouses.associate = () => {
    // Pertence a User id - ( 1 User do Users)
    Warehouses.belongsTo(Users, {
      foreignKey: 'created_id',
      allowNull: false
    });
    // Tem muitos medicamentos warehouse_id - ( Warehouses )
    Warehouses.hasMany(Medicines, {
      foreignKey: 'warehouse_id',
      allowNull: false,
    });
  };


module.exports = { Warehouses }