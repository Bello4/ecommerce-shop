const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary')

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION Shutting down...');
    process.exit(1);
});

dotenv.config({ path: './config.env'});
const app = require('./app');
//console.log(process.env);
//NwXXceTgWuhg9K5G
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
//mongoose.connect(process.env.DATABASE_LOCAL, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('DB connection successfull!'));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLE REJECTION Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});

// process.on('SIGTERM', () => {
//     console.log(' SIGTERM RECEIVED. Shutting dowm gracefully');
//     server.close(() => {
//         console.log('process terminated!');
//     });
// });