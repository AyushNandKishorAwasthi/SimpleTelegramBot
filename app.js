const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const express= require('express');
const app = express();
dotenv.config({path:'./config.env'})
const bot = new TelegramBot(process.env.TOKEN,{polling: true});
// bot.on('text',msg=>{
//     console.log(msg);
// })
const userData={
    name:'',
    contact:'',
    location:'',
    email:'',
}
bot.onText(/\/start/,(msg)=>{
    bot.sendMessage(msg.chat.id,'Hello, I am Autobot ready for help. I need to know your name, location, mobile number and e-mail address. Would you like to proceed ?',{
        "reply_markup": {
            "keyboard": [
                [ 
                    "YES",
                    "NO"
                ],
            ],
            "one_time_keyboard":true,
            "resize_keyboard":true

        }
    })
})
bot.on('message',msg=>{
    if(msg.text&&msg.text.includes("YES"))
    return bot.sendMessage(msg.chat.id,'Please enter your name (Telegram username)');
    
    if(msg.text&&msg.text.includes("NO"))
    return bot.sendMessage(msg.chat.id,'Thankyou, nice to see you again');
})
bot.on("text",msg=>{
    if(msg.text&&msg.text.includes(msg.chat.first_name)){
        userData.name=msg.text;
        return bot.sendMessage(msg.chat.id,'Please enter your contact number');
    }
})


bot.onText(/^[0-9]+$/,msg=>{
    if(msg.text.length<10)
    return bot.sendMessage(msg.chat.id,'Please enter a valid contact number');
    userData.contact=msg.text;
    return bot.sendMessage(msg.chat.id,'Please enter your email address');
})

bot.on('message',msg=>{
    if(msg.entities && msg.entities[0].type==='email'){
        userData.email=msg.text;
        return bot.sendMessage(msg.chat.id,'Please send us your location');
    }
})

bot.on('message',msg=>{
    if(msg.location){
        userData.location=msg.location;
        return bot.sendMessage(msg.chat.id,'These are your details:\nName:'+userData.name+'\nContact:'+userData.contact+'\nEmail:'+userData.email+'\nLocation: Long='+userData.location.longitude+',Lat='+userData.location.latitude+'\n\n Do you wish to proceed ?',{
            "reply_markup": {
                "keyboard": [
                    [ 
                        "PROCEED",
                        "DON'T PROCEED"
                    ],
                ],
                "one_time_keyboard":true,
                "resize_keyboard":true
    
            }
        });
    }
    // console.log(userData);
})
bot.on('message',msg=>{
    if(msg.text&&msg.text==="PROCEED")
    return bot.sendMessage(msg.chat.id,'Our team will contact you shortly. Thankyou for your time.')
    
    if(msg.text&&msg.text==="DON'T PROCEED")
    return bot.sendMessage(msg.chat.id,'Thankyou, nice to see you again')
})

bot.on("polling_error",console.log)

const port = process.env.PORT||4000;
const server = app.listen(port,()=>{
    console.log('server listening on port '+port);
})

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection Shutting Down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
  
  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down...');
    server.close(() => {
      console.log('Process terminates.');
    });
  });

// bot.on('callback_query', async(callbackQuery)=>{
//     await bot.answerCallbackQuery(callbackQuery.id);
//     if(callbackQuery.data.includes('yes'))
//     bot.sendMessage(callbackQuery.message.chat.id,'Under development',)
//     if(callbackQuery.data.includes('no'))
//     bot.sendMessage(callbackQuery.message.chat.id,'Ok '+callbackQuery.message.chat.first_name+' have a nice meeting you')
    
//   });



// bot.on('message',(msg)=>{
//     if(msg)
//     bot.sendMessage(msg.chat.id,'I need to know your name, location, mobile number and e-mail address')
//     if(msg.text.includes('no'))
//     bot.sendMessage(msg.chat.id,'Ok '+msg.chat.first_name+' have a nice meeting you');
// })

