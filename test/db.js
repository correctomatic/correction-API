import { Sequelize } from 'sequelize'
import config from '../sequelize/config'

const sequelize = new Sequelize(config.test)

export default sequelize
