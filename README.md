# Cotação Moedas
Bot do Telegram para consulta das moedas Dólar e Euro na região de Brasília/DF. Utiliza node.js e o a API do Telegram.

### Dependências
```sh
$ npm install node-telegram-bot-api
$ npm install request-json
```

### Comandos Disponíveis

`/start` retorna cotação do Dólar atualizada<br />
`/Ver cotação` retorna a opção de ver a cotaçao atualiazada do Euro e do Dólar em papel moeda e cartão pré-pago<br />
`/Criar alerta` retorna a opção de criar alertas para o preço do Euro e do Dólar. Sempre que o valor em papel moeda do euro ou dolar turismo forem menor do que o valor do ultimo alerta, o usuario receberá um alerta via bot do telegram.<br />
