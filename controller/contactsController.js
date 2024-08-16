const { default: axios } = require('axios')
const { Say } = require('twilio/lib/twiml/VoiceResponse')
const connection = require('../db/connection')
const twilio = require('../twilio/twilio')

// get all contacts
exports.getAllContacts = async(req,res) => {
    const {dataStore} = req.body

    if (dataStore === 'CRM') {
        try {
            const response = await axios.get(`https://freelance-744221201780272877.myfreshworks.com/crm/sales/api/contacts/view/402009682374`, {
                headers: {
                    Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`
                }
            });
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving contact from CRM', error });
        }
    } else if (dataStore === 'DATABASE') {
        try {
            connection.query('SELECT * FROM contacts',(error,result)=>{
                if (result) {
                    res.status(200).json(result)    
                } else {
                    res.status(400).json("Failed to get all contacts")
                }
            })
        } catch (error) {
            res.status(400).json('Failed to get all contacts')
        }
    }    
    else {
        res.status(400).json({ message: 'Invalid data_store value' });
    }
}

// get contact
exports.getContact = async(req,res) => {
    console.log(req.body);
    const {idcontacts,dataStore} = req.body

    if (dataStore === 'CRM') {

        try {
            const response = await axios.get(`https://freelance-744221201780272877.myfreshworks.com/crm/sales/api/contacts/${idcontacts}`, {
                headers: {
                    Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`
                }
            });
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving contact from CRM', error });
        }
        
    } else if (dataStore === 'DATABASE') {

        try {
            console.log('All');
            connection.query('SELECT * FROM contacts WHERE idcontacts = ?',[idcontacts],(error,result)=>{
                if(result && result.length > 0){
                    console.log('here');
                    res.status(200).json(result[0])
                    //res.status(200).json(`Contact : ${result[0]}`)
                }
                else {
                    res.status(400).json('Failed to get contact')
                }
            })
        } catch (error) {
            res.status(400).json('Failed to get contact')
        }
        
    } else {
        res.status(400).json({ message: 'Invalid data_store value' }); 
    }

}

// create a contact
exports.createContact = async(req,res) => {
    console.log(req.body);
    const {first_name,last_name,email,mobile_number,dataStore} = req.body

    if(dataStore === 'CRM'){

        try {

            const contactData = {
                contact:{first_name,last_name,email,mobile_number}
            }

            // if (idcontacts) {
            //     contactData.contact.idcontacts = idcontacts;
            // }

            const response = await axios.post('https://freelance-744221201780272877.myfreshworks.com/crm/sales/api/contacts',contactData, {
                headers: {
                    Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            res.status(201).json({ message: 'Contact created in CRM', contact: response.data });
        } catch (error) {
            if (error.response) {
                console.error('API Error:', error.response.data);
                res.status(500).json({ message: 'Error creating contact in CRM', error: error.response.data });
            } else {
                console.error('Unexpected Error:', error.message);
                res.status(500).json({ message: 'Error creating contact in CRM', error: error.message });
            }
        }

    } else if (dataStore === 'DATABASE') {

        try {
            connection.query('INSERT INTO contacts SET ?',{first_name,last_name,email,mobile_number},(error,result)=>{
                if(result){
                    res.status(200).json(`Created Contact : ${first_name}`)
                }
                else {
                    res.status(400).json('Failed to create contact')
                }
            }) 
            
        } catch (error) {
            res.status(400).json('Failed to create contact')
        }
        
    } else {
        res.status(400).json({ message: 'Invalid data_store value' });
    }
}


// update contact
exports.updateContact = async(req,res) => {
    console.log(req.body);
    const {new_email,new_mobile_number,idcontacts,dataStore} = req.body

    if (dataStore === 'CRM') {

        const contactData = {
            contact:{email: new_email, mobile_number: new_mobile_number }
        }
        
        try {
            const response = await axios.put(`https://freelance-744221201780272877.myfreshworks.com/crm/sales/api/contacts/${idcontacts}`,contactData, {
                headers: {
                    Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            res.status(200).json({ message: 'Contact updated in CRM', contact: response.data });
        } catch (error) {
            if (error.response) {
                console.error('API Error:', error.response.data);
                res.status(500).json({ message: 'Error creating contact in CRM', error: error.response.data });
            } else {
                console.error('Unexpected Error:', error.message);
                res.status(500).json({ message: 'Error creating contact in CRM', error: error.message });
            }
        }


    } else if (dataStore === 'DATABASE') {

        try {
            connection.query('SELECT * FROM contacts WHERE idcontacts = ?',[idcontacts],(error,result)=>{
                if (result && result.length > 0) {
                    connection.query('UPDATE contacts SET email = ?, mobile_number = ? WHERE idcontacts = ?',[new_email,new_mobile_number,idcontacts],(error,result)=>{
                        if(result){
                            res.status(200).json(`Updated Contact`)
                        }
                        else {
                            res.status(400).json('Failed to update contact')
                        }
                    })
                } else {
                    res.status(404).json('Contact not found');
                }
            })
        } catch (error) {
            res.status(400).json('Failed to update the contact')
        }
        
    } else {
        res.status(400).json({ message: 'Invalid data_store value' });
    } 


}


// delete contact
exports.deleteContact = async(req,res) => {
    console.log(req.body);
    const {idcontacts,dataStore} = req.body

    if (dataStore === 'CRM') {

        try {
            await axios.delete(`https://freelance-744221201780272877.myfreshworks.com/crm/sales/api/contacts/${idcontacts}`, {
                headers: {
                    Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`
                }
            });
            res.status(200).json({ message: 'Contact deleted from CRM' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting contact from CRM', error });
        }
        
    } else if (dataStore === "DATABASE") {
       
        try {
            connection.query('SELECT * FROM contacts WHERE idcontacts = ?',[idcontacts],(error,result)=>{
                if (result && result.length > 0) {
                    connection.query('DELETE FROM contacts WHERE idcontacts = ?',[idcontacts],(error,result)=>{
                        if(result){
                            console.log('here');
                            res.status(200).json('Deleted')
                            //res.status(200).json(`Contact : ${result[0]}`)
                        }
                        else {
                            res.status(400).json('Failed to delete contact')
                        }
                    })
                } else {
                    res.status(404).json('Contact not found');
                }
            })
        } catch (error) {
            res.status(400).json('Failed to delete contact')
        }
        
    } else {
        res.status(400).json({ message: 'Invalid data_store value' });
    }

    
}


// get twilio 
exports.getCall = async(req,res) => {
    try {
        const digits = req.query.Digits;

        if (digits === '1') {
            res.send('<Response><Say>Thank you! We will send you a personalized interview link shortly.</Say></Response>');
            // Send the personalized interview link via SMS or Email
        } else {
            res.send('<Response><Say>No input detected. Goodbye!</Say></Response>');
        }

    } catch (error) {
        res.status(400).json('Failed to get response')
    }
}

const toNumber = '+918113000923'
const fromNumber = process.env.TWILIO_NUMBER

exports.makeCall = () => {
    return twilio.calls.create({
        to: toNumber,
        from: fromNumber,
        twiml: `<Response>
                    <Gather action="/gather" method="POST">
                        <Say>Welcome to the interview scheduling system. Press 1 to receive a personalized interview link.</Say>
                    </Gather>
                    <Pause length="5"/>
                    <Say>No input detected. Goodbye!</Say>
                </Response>`,
    })
}



exports.gatherDigit = async (req,res) => {
    console.log("inside gather");
    const interviewLink = "https://v.personaliz.ai/?id=9b697c1a&uid=fe141702f66c760d85ab&mode=test";
    const digits = req.body.Digits

    console.log(digits);
    
    try {

        if(digits === 1){
            
            const message = await twilio.messages.create({
                body:`Thank you for your interest! Here is your personalized interview link: ${interviewLink}`,
                from:fromNumber,
                to:toNumber
            })

            console.log(`SMS sent`);
            res.send(`<Response><Say>Thank you! We have sent you a personalized interview link via SMS.</Say></Response>`);

        } else if (digits === 2) {

            res.send('<Response><Hangup/></Response>');

        } else {

            res.send('<Response><Say>No input detected. Goodbye!</Say><Hangup/></Response>');

        }

    } catch (error) {

        console.error('Error sending SMS:', error);
        res.send(`<Response><Say>Sorry, there was an error sending the interview link. Please try again later.</Say></Response>`);

    }
        
}




