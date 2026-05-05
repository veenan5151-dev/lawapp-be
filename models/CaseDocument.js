import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Case from "./Case.js";

const CaseDocument = sequelize.define(
    "CaseDocument",
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
        type: {
            type: DataTypes.ENUM("FIR", "Evidence", "Order", "Misc"),
            allowNull: false,
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        originalName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true },
);

CaseDocument.belongsTo(Case, { foreignKey: "caseId" });
Case.hasMany(CaseDocument, { foreignKey: "caseId" });

export default CaseDocument;
