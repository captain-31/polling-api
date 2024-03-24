import '../../env.js'
import mongoose from 'mongoose'

const url = process.env.DB_URL

export const connectUsingMongoose = async() => {

    try {
        await mongoose.connect(url)
        console.log('MongoDB connected using Mongoose')
    } catch(error) {
        console.log('Error connecting to MongoDB: ', error.message)
    }
    
}
