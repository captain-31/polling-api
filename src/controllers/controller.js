import { ObjectId } from "mongodb"
import optionModel from "../models/options.schema.js"
import questionModel from "../models/questions.schema.js"
import mongoose, { isValidObjectId } from "mongoose"

// Create question 
export const createQuestion = async (req, res) => {
    console.log('in create question')

    try {
        const { title } = req.body
        if (!title) {
            throw { status: 400, message: 'Question\'s title is required' };
        }
        const newQuestion = await questionModel.create({ title: title })
        res.status(201).send({ message: 'Question added', data: newQuestion })
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
}

// Add option
export const addOption = async (req, res) => {
    console.log('in add option')

    try {
        const { text } = req.body
        if (!text) {
            throw { status: 400, message: 'Option\'s text is required' };
        }

        // save option 
        const newOption = new optionModel({ text: text })
        const link_to_vote = `${req.protocol}://${req.headers.host}/options/${newOption._id}/add_vote`
        newOption.link_to_vote = link_to_vote
        newOption.questionId = req.params.id
        await newOption.save()
        // console.log(newOption)

        // update option id in questions array
        const question = await questionModel.findById(req.params.id)
        // console.log(question)
        question.options.push(newOption._id)
        await question.save()

        res.status(201).send({ message: 'Option added', data: newOption })
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).send(error.message || 'Internal Server Error');
    }
}

// To view question and its options
export const viewQuestion = async (req, res) => {

    try {
        const id = req.params.id

        // Define the aggregation pipeline
        const pipeline = [
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'options',
                    localField: 'options',
                    foreignField: '_id',
                    as: 'options'
                }
            }
        ];
        const result = await questionModel.aggregate(pipeline).exec();

        // Check if any result is found
        if (!result || result.length === 0) {
            return res.status(404).send({ error: 'Question not found' });
        }

        res.status(200).send({ message: 'Question fetched!', data: result })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error.message });
    }
}

// To add vote
export const addVote = async (req, res) => {

    try {
        const optionId = req.params.id
        const option = await optionModel.findById(optionId)

        if (!option) {
            return res.status(404).send({ error: 'Invalid option id' });
        }

        option.votes += 1;
        await option.save()

        res.status(200).send({ message: 'Vote submitted', data: option })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error.message });
    }
}

// To Delete option 
// (An option can’t be deleted if it has even one vote given to it)
export const deleteOption = async (req, res) => {
    try {
        const optionId = req.params.id
        const option = await optionModel.findById(optionId)
        if (!option) {
            return res.status(404).send({ error: 'Invalid option id' });
        }

        if (option.votes != 0) {
            return res.status(405).send({ error: 'Option cant be deleted, it has votes' });
        }

        const result = await optionModel.findByIdAndDelete(optionId)
        res.status(200).send({ message: 'Option deleted successfully!', data: result })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error.message });
    }
}

// To delete a question 
// A question can’t be deleted if one of it’s options has votes
export const deleteQuestion = async (req, res) => {

    try {
        const questionId = req.params.id

        const question = await questionModel.findById(questionId).populate('options').exec();
        if (!question) {
            return res.status(404).send({ error: 'Invalid question id' });
        }

        const options = question.options;
        if (options.length == 0) {
            await questionModel.findByIdAndDelete(questionId)
            return res.status(200).send({ message: 'Question deleted successfully!' })
        }

        // Check if any option has votes more than 0
        const hasVotes = options.some(option => option.votes > 0);
        if (hasVotes) {
            return res.status(405).send({ error: 'Question cannot be deleted as one of its options has votes.' });
        }

        // Delete its options first
        const deletedOptions = await optionModel.deleteMany({ _id: { $in: options.map(option => option._id) } }).exec();
        console.log(`${deletedOptions.deletedCount} option(s) deleted.`);

        // Delete the question
        await questionModel.findByIdAndDelete(questionId)

        res.status(200).send({ message: `Question deleted successfully! ${deletedOptions.deletedCount} options also deleted.` });
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error.message });
    }
}