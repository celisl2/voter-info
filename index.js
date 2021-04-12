const express = require('express');
const app = express();

const path = require('path');

app.set('views', path.join(__dirname, 'views')); //source of template
app.set('view engine', 'pug'); //tells node what engine to use
app.use(express.static(path.join(__dirname, 'public'))); //where to find static assets

app.get('/', (req, res) => {
    //res.send("Hello");
    res.render('index');
})

const server = app.listen(3000, () => {
    console.log(`Application started on port ${server.address().port}`)
});