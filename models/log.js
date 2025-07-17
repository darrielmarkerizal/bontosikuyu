"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      // define association here
      Log.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }

    // Helper method untuk format data
    getOldValuesJSON() {
      try {
        return this.oldValues ? JSON.parse(this.oldValues) : null;
      } catch (e) {
        return null;
      }
    }

    getNewValuesJSON() {
      try {
        return this.newValues ? JSON.parse(this.newValues) : null;
      } catch (e) {
        return null;
      }
    }
  }
  Log.init(
    {
      action: {
        type: DataTypes.ENUM(
          "CREATE",
          "UPDATE",
          "DELETE",
          "LOGIN",
          "LOGOUT",
          "VIEW",
          "DOWNLOAD",
          "UPLOAD"
        ),
        allowNull: false,
        validate: {
          isIn: [
            [
              "CREATE",
              "UPDATE",
              "DELETE",
              "LOGIN",
              "LOGOUT",
              "VIEW",
              "DOWNLOAD",
              "UPLOAD",
            ],
          ],
        },
      },
      tableName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      recordId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isInt: true,
        },
      },
      oldValues: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
        validate: {
          isValidJSON(value) {
            if (value) {
              try {
                JSON.parse(value);
              } catch (e) {
                throw new Error("oldValues must be valid JSON");
              }
            }
          },
        },
      },
      newValues: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
        validate: {
          isValidJSON(value) {
            if (value) {
              try {
                JSON.parse(value);
              } catch (e) {
                throw new Error("newValues must be valid JSON");
              }
            }
          },
        },
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        validate: {
          isIP: true,
        },
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Log",
    }
  );
  return Log;
};
