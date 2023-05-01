
const mongoose = require('mongoose')
const MONGO_URL = 'mongodb+srv://username:<password>@cluster0.gjg6m66.mongodb.net/test';

const MONGO_OPTIONS: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000,
};
mongoose.connect(MONGO_URL, MONGO_OPTIONS)
.then(() => console.log('Connected to MongoDB database!'))
  .catch((err:any) => console.error(err));
  
export const db = mongoose.connection




