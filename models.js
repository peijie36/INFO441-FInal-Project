import mongoose from 'mongoose'
let models = {}

mongoose.set('strictQuery', false);

await mongoose.connect('mongodb+srv://foodies:info441foodies@foodie.5lkmqj1.mongodb.net/foodie')
console.log("connected to database!")

const itemSchema = new mongoose.Schema({
    url: String,
    name: String,
    info: Object
})

const inventorySchema = new mongoose.Schema({ 
    userId: String,
    itemId: String,
    amountTheyHave: {
        type: Number,
        default: 0
    },
    frequencyPurchased: {
        type: Number,
        default: 0
    },
    lastPurchasedDate: {
        type: Date,
        default: new Date()
    },
    totalAmountPurchased: {
        type: Number,
        default: 0
    },
})

const authSchema = new mongoose.Schema({
    email: String,
    password: String,
})

models.Item = mongoose.model('Item', itemSchema)
models.Inventory = mongoose.model('Inventory', inventorySchema)
models.Auth = mongoose.model('Auth', authSchema)
console.log("models created")

export default models