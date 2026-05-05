import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Case from "./Case.js";

const CaseNote = sequelize.define(
    "CaseNote",
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
        note: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    { timestamps: true },
);

CaseNote.belongsTo(Case, { foreignKey: "caseId" });
Case.hasMany(CaseNote, { foreignKey: "caseId" });

export default CaseNote;
