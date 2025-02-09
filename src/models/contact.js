module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define(
    "Contact",
    {
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          customValidator(value) {
            if (!value && !this.email) {
              throw new Error("Either phoneNumber or email must be provided");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
          customValidator(value) {
            if (!value && !this.phoneNumber) {
              throw new Error("Either phoneNumber or email must be provided");
            }
          }
        }
      },
      linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Contacts',
          key: 'id'
        }
      },
      linkPrecedence: {
        type: DataTypes.ENUM("primary", "secondary"),
        allowNull: false,
        defaultValue: "primary"
      }
    },
    {
      timestamps: true,
      paranoid: true,
      indexes: [
        { fields: ['email'] },
        { fields: ['phoneNumber'] },
        { fields: ['linkedId'] }
      ]
    }
  );

  return Contact;
};
