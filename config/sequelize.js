import { Sequelize } from "sequelize";

const sequelize = new Sequelize("lawapp", "root", "root", {
    host: "localhost",
    dialect: "mysql",
});

export default sequelize;
