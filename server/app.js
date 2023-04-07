const express = require('express');
const app = express();
const dogs = require('./routes/dogs.js')
require('dotenv').config()
app.use(express.static('assets'))
app.use(express.json())
app.use('/dogs', dogs)


console.log(process.env.NODE_ENV)

const loggerMiddleWare = (req, res, next,) => {
    console.log(`
    METHOD: ${req.method} 
    URL: ${req.url}`)
    res.on('finish', () => {
    console.log(`STATUSCODE: ${res.statusCode}`)
  })

  next()
}

app.use(loggerMiddleWare)
// For testing purposes, GET /
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  // req.body = {color:'red'}
  res.json(req.body);
  next();
});

app.use((req, res, next)=>{
  next(new Error(`"The requested resource couldn't be found"`)) 
}) 

const errorHandlingMiddleWare = (err, req, res, next) => {
 if(process.env.NODE_ENV==='development'){
  console.log(err)
  res.status(res.statusCode||500).send("Something went wrong")}
 
}
app.use(errorHandlingMiddleWare)
// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});

const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`Server is listening on port: ${port}`));