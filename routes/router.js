const express = require('express')
const contactsController = require('../controller/contactsController')

const router = new express.Router()

// get all contacts
router.get('/getAllContact',contactsController.getAllContacts)

// get contacts
router.get('/getContact',contactsController.getContact)

// add new contact
router.post('/createContact',contactsController.createContact)

// update contact
router.put('/updateContact',contactsController.updateContact)

// delete contact
router.delete('/deleteContact',contactsController.deleteContact)

// make call
router.get('/makeCall',contactsController.makeCall)

// process user input 
router.post('/gather',contactsController.gatherDigit)

module.exports = router