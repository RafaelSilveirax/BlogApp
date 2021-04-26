if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://rafa:123456rss@cluster0.s1uhr.mongodb.net/Cluster0?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp" }
}