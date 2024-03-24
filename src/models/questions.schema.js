import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    }]

})

const questionModel = mongoose.model('Question', questionSchema)

export default questionModel