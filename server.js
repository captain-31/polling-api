import app from "./app.js"
import { connectUsingMongoose } from "./src/config/mongodb.js"

app.listen(3000, () => {
    console.log('Server is running at 3000')
    connectUsingMongoose()
})