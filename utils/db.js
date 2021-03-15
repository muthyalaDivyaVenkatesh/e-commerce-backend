const MongoClient = require('mongodb').MongoClient;
let  _db;

// connect
const mongoConnet = (URL) =>{
    return MongoClient.connect(URL).then(client => {
        console.log("connected",client.db())
        _db = client.db()
        // console.log(_db)
        _db
    })
    .catch(err =>{
        console.log(err)
        throw err
    })
}


const getDb = () => {
    if(_db) {
        return _db
    }
    return "No Db Connected"
}

module.exports = {
    mongoConnet,
    getDb
}