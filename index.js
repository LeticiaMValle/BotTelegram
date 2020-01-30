

const TelegramBot = require('node-telegram-bot-api');
var request = require('request-json');
var client = request.createClient('http://localhost:5000/');

let result_euro = 0
let result_dolar = 0
let euro_base = 6.00
let dolar_base = 6.00

const token = '1079032143:AAFobvvLmDB8YO-UUm0KkZZqVmhuyiEX3GM';
const bot = new TelegramBot(token, {
    polling: true
});


bot.onText(/\/start/, (msg, match) => {

    fromId = msg.from.id;

    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Ver cotação'],
                ['Criar alertas']
            ],
            'one_time_keyboard': true
        })
    };
    if(msg.chat.type=="private")
        bot.sendMessage(msg.chat.id, 'Olá! Esse é um bot de cotação de moeda para a região de Brasilia/DF.', opts);
    
});



bot.onText(/Ver cotação/i, (msg, match) => {
    
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: 'USD',
                        callback_data: JSON.stringify({
                            base: 'USD'
                        })
                    },
                    {
                        text: 'EUR',
                        callback_data: JSON.stringify({
                            base: 'EUR'
                        })
                    },
                    
                ]
            ]
        }
    };
    bot.sendMessage(msg.chat.id, 'Escolha a moeda', opts);
});

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const data = JSON.parse(callbackQuery.data);
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;
    if (data.base === 'EUR') {
        client.get('https://www.melhorcambio.com/cotacao/compra/euro/brasilia', function(err, res, body) {
        result = body.match(/span><span>(.*?)<\/span>/g).map(
            (v) => v.replace(/\D/g, ''));  
         
        //console.log('VALOR:', result[0])
        bot.sendMessage(opts.chat_id, "Euro: \n" + "Moeda: R$ " + result[0]/100 + "\n" + "Cartão pré pago: R$ "  + result[1]/100 + "\n");
        })       
    }

    if (data.base === 'USD') {
        client.get('https://www.melhorcambio.com/cotacao/compra/dolar-turismo/brasilia', function(err, res, body) {
        var result = body.match(/span><span>(.*?)<\/span>/g).map(
            (v) => v.replace(/\D/g, ''));  
         
        bot.sendMessage(opts.chat_id, "Dólar: \n" + "Moeda: R$ " + result[0]/100 + "\n"+ "Cartão pré pago: R$ "  + result[1]/100 + "\n");
       })       
    }
});


bot.onText(/Criar alerta/i, (msg, match) => {
    
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: 'USD',
                        callback_data: JSON.stringify({
                            base: 'USD_alerta'
                        })
                    },
                    {
                        text: 'EUR',
                        callback_data: JSON.stringify({
                            base: 'EUR_alerta'
                        })
                    },
                    
                ]
            ]
        }
    };
    bot.sendMessage(msg.chat.id, 'Escolha a moeda que você quer criar o alerta.', opts);
});


bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const data = JSON.parse(callbackQuery.data);
    const msg = callbackQuery.message;
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;
    if (data.base === 'EUR_alerta') {

        bot.sendMessage(opts.chat_id, "Alerta euro criado.");
        function search_euro() {
            client.get('https://www.melhorcambio.com/cotacao/compra/euro/brasilia', function(err, res, body) {
                result_euro = body.match(/span><span>(.*?)<\/span>/g).map(
                    (v) => v.replace(/\D/g, ''));

                if (result_euro[0]/100 < euro_base) {
                    bot.sendMessage(opts.chat_id, "Alerta de menor valor para o euro: R$" + result_euro[0]/100);
                    euro_base = result_euro[0]/100;
                }    
            })   
        }
        var func_euro = search_euro;
        var run = setInterval(func_euro, 10000);
    }       
    

    if (data.base === 'USD_alerta') {
     
        bot.sendMessage(opts.chat_id, "Alerta dólar criado.");

        search_dolar();
        function search_dolar() {
            client.get('https://www.melhorcambio.com/cotacao/compra/dolar-turismo/brasilia', function(err, res, body) {
                result_dolar = body.match(/span><span>(.*?)<\/span>/g).map(
                    (v) => v.replace(/\D/g, ''));

                if (result_dolar[0]/100 < dolar_base) {
                    bot.sendMessage(opts.chat_id, "Alerta de menor valor para o dólar: R$" + result_dolar[0]/100);
                    dolar_base = result_dolar[0]/100;
                }    
            })   
        }
        var func_dolar = search_dolar;
        var run = setInterval(func_dolar, 10000);     
    }
});