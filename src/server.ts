import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['warn', 'error', 'info', 'query'] })
const app = express()
app.use(cors())
app.use(express.json())

const port = 5678

app.get('/people', async (req, res) => {
  const people = await prisma.person.findMany({
    include: { dogs: true, cats: true }
  })
  res.send(people)
})

app.get('/people/:id', async (req, res) => {
  const person = await prisma.person.findUnique({
    where: { id: Number(req.params.id) },
    include: { dogs: true }
  })

  if (person) {
    res.send(person)
  } else {
    res.status(404).send({ error: 'Person not found.' })
  }
})

app.post('/people', async (req, res) => {
  const person = await prisma.person.create({
    data: req.body,
    include: { dogs: true }
  })
  res.send(person)
})

app.delete('/people/:id', async (req, res) => {
  const id = Number(req.params.id)
  const person = await prisma.person.delete({
    where: { id }
  })
  res.send(person)
})

app.patch('/people/:id', async (req, res) => {
  const id = Number(req.params.id)
  const person = await prisma.person.update({
    where: { id },
    data: req.body,
    include: { dogs: true }
  })
  res.send(person)
})

app.get('/dogs', async (req, res) => {
  const dogs = await prisma.dog.findMany({ include: { person: true } })
  res.send(dogs)
})

app.get('/dogs/:id', async (req, res) => {
  const id = Number(req.params.id)
  const dog = await prisma.dog.findUnique({
    where: { id },
    include: { person: true }
  })

  if (dog) {
    res.send(dog)
  } else {
    res.status(404).send({ error: 'Dog not found.' })
  }
})

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`)
})
