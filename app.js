import express from 'express'
import router from './src/routes/routes.js'

const app = express()

// Parse JSON bodies for API requests
app.use(express.json())

// Routes
app.use('/', router)

// Default req handler
app.get('/', (req, res) => {
    res.send('Welcome to Polling API')
})

// Handle 404 requests
app.use((req, res) => {
    res.status(404).send('API not found.');
})

export default app