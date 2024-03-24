import express from 'express'
import { addOption, createQuestion, viewQuestion, addVote, deleteOption, deleteQuestion } from '../controllers/controller.js'

const router = express.Router()

// To create question
router.post('/questions/create', createQuestion)

// To create option
router.post('/questions/:id/options/create', addOption)

// To view question and its options
router.get('/questions/:id', viewQuestion)

// To increment the count of votes (add votes)
router.put('/options/:id/add_vote', addVote)

// To delete an option (An option can’t be deleted if it has even one vote given to it)
router.delete('/options/:id/delete', deleteOption)

// To delete a question (A question can’t be deleted if one of it’s options has votes)
router.delete('/questions/:id/delete', deleteQuestion)

export default router
