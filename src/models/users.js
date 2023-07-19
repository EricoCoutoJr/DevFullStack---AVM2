const { STRING, DATE, DataTypes, DATEONLY } = require('sequelize')
const { connection } = require('../database/connection')

const Users = connection.define("users", {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            len: { args: [2, 20],
                   msg: 'O nome deve possuir entre 2 e 20 caracteres' },
            notNull: {msg: "O campo name é obrigatório."}
        },
        get() {
            const rawValue = this.getDataValue('name');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    lastname: {
            type: STRING,
            allowNull: false,
            validate: {
                len: { args: [2, 20],
                       msg: 'O campo sobrenome deve possuir entre 2 e 20 caracteres' },
                notNull: { msg: "O campo lastname é obrigatório."}
        },
        get() {
            const rawValue = this.getDataValue('lastname');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    gender:{
        type: STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('gender');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    birthdate: {
        type: DATEONLY,
        allowNull: false,
        validate:{
            // Data não poderá ser posterior a data de registro
            dateValidator(value) {
                if (new Date(value) > new Date()) {
                  throw new Error("Data invalida");
                }
            notNull: {msg: "O campo birthdate é obrigatório."}
        },
    }},
    cpf: {
        type: STRING,
        allowNull: false,
        validate: {   
          len: {
            args: [11, 11],
            msg: "Este campo deve ter exatamente 11 caracteres."
          },
          notNull: {msg: "O campo CPF é obrigatório."}
        },
        unique: { 
            msg: { "msg":"CPF já está cadastrado.", "status": "409"}
          }
    },
    fone: {
        type: STRING,
        allowNull: true
    },
    email: {
        type: STRING,
        allowNull: false,
        validate:{
            isEmail: {msg: "Email Invalido"},
            notNull: { msg: "O campo email é obrigatório" }
        },
        unique: {msg: { "msg":"Email já está cadastrado.", "status": "409"}},
        get() {
            const rawValue = this.getDataValue('email');
            return rawValue ? rawValue.toUpperCase() : null;
          }
    },
    password: {
        type: STRING,
        allowNull: false,
        validate:{
            is: {
                args: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$",
                msg: "Deve ter no mínimo 8 caracteres, mínimo 1 letra maiúscula, mínimo 1 número e mínimo 1 caracteres especial"
                },
            notNull: {msg: "O campo password é obrigatório."}    
        }
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
{ underscored: true, paranoid: true });

Users.associate= (models) => {
    // Tem muitos medicamentos - ( Medicines )
    Users.hasMany(models.Medicines, {
      foreignKey: 'created_by',
      allowNull: false
    });
    // Tem muitos depósitos - ( WareHouses )
    Users.hasMany(models.WareHouses, {
      foreignKey: 'created_by',
      allowNull: false
    });
  };



module.exports = { Users }