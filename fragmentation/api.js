const express = require('express')
const { fragmentation } = require('.')
const app = express()

app.use(express.json())

app.post('/fragment', (req, res) => {
  const code = req.body.code
  const result = fragmentation(code)
  res.json(result)
})

app.listen(3000, () => {
  console.log('API running on port 3000')
})

