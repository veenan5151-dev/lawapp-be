import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Case from "./Case.js";

const Hearing = sequelize.define(
    "Hearing",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        caseId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "Cases", key: "id" },
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM("hearing", "deadline"),
            defaultValue: "hearing",
        },
        completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { timestamps: true },
);

Hearing.belongsTo(Case, { foreignKey: "caseId" });
Case.hasMany(Hearing, { foreignKey: "caseId" });

export default Hearing;
