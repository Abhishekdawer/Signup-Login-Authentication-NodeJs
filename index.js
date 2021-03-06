const express = require('express');
const routes = require('./routes');
const path = require('path');

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.get('/',routes);
app.post('/register',routes);
app.get('/login',routes);
app.post('/login',routes);
app.get('/success',routes);
app.get('/logout',routes);
app.post('/addmsg',routes);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Server started at Port",port);
});