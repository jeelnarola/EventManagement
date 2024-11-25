const {Router} = require('express')
const {EventAdd, EventShowupcoming, EventFilter, Eventrsvp, EventEdit, EventDelete} = require('../../controllers/Event/event.controller')

const EventRouter = Router()

EventRouter.post('/add',EventAdd)
EventRouter.get('/',EventShowupcoming)
EventRouter.get('/events',EventFilter)
EventRouter.post('/rsvp',Eventrsvp)
EventRouter.patch('/edit/:id',EventEdit)
EventRouter.delete('/delete/:id',EventDelete)

module.exports = EventRouter