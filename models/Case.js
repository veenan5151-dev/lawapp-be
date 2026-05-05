import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import User from "./User.js";

const Case = sequelize.define(
    "Case",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        caseNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        courtName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("Active", "Closed", "Pending"),
            defaultValue: "Pending",
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    },
);

// Associations
Case.belongsTo(User, { as: "client", foreignKey: "clientId" });
User.hasMany(Case, { as: "cases", foreignKey: "clientId" });

export default Case;
