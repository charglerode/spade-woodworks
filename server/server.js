const mongoose = require('mongoose');
const env = require('dotenv');
const app = require('./app');

env.config({ path: './.env' });

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS);
mongoose.connect(db)
.then(() => console.log('Connected to database!'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});