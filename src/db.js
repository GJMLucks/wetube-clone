import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
    useNewUrl: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
});

const db = mongoose.connection;

const handleOpenServer = function() {
    console.log("connected to DB");
}
const handleError = function(err) {
    console.log("DB error: " + err, err);
};

db.on("error", handleError);
db.once("open", handleOpenServer);