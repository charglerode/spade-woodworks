const env = require('dotenv');
env.config({ path: './.env' });

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});