const express = require('express')
const app = express()
app.use(express.json())
const uuid = require('uuid')



let produtos = [ 
    {id: uuid.v4(), dataCompra:'2019/08/23', localCompra: 'São Paulo', valor: 2300.00, responsavel: 'Pedro Xavier'},
    {id: uuid.v4(), dataCompra:'2020/01/29', localCompra: 'Alagoas', valor: 950.00, responsavel: 'Karina Silva'}
]


const checkIDInArray = (request, response, next) => {
    const{id} = request.params
    const existID = produtos.find(checa => checa.id === id)
    if (!existID){
        return response
            .status(400)
            .json({ error: 'Id Inexistente!'})
    }
        return next()
}

const checkInformation = (request, response, next) => {
    const {dataCompra, localCompra, valor, responsavel} = request.body
    if(!dataCompra || !localCompra || !valor || !responsavel){
        return response
            .status(400)
            .json({ error: 'Alguma informação não foi fornecida corretamente'})
    }
    return next()
}


app.post('/despesas', checkInformation, (request, response) =>{
    const {dataCompra, localCompra, valor, responsavel} = request.body
    const incluirCompra = {
        id: uuid.v4(),
        dataCompra,
        localCompra,
        valor,
        responsavel
    }
    produtos = [...produtos, incluirCompra]
    return response
        .status(200)
        .json(incluirCompra)
})

app.get('/despesas', (request, response) => {
        return response
            .status(200)
            .json(produtos)
})

app.get('/despesas/:id', checkIDInArray, (request, response) => {
    const {id} = request.params
    const checkID = produtos.filter(checa => checa.id === id)
    return response
        .status(200)
        .json(checkID)
})

app.get('/despesa/gastototal', (request, response) => {
    const somaValor = produtos.reduce((soma, valor) => {
        return soma + valor.valor
    }, 0)
    return response 
        .status(200)
        .json({ "gasto total": somaValor})
})

app.get('/despesa/gastoresponsavel', (request, response) => {
    const { responsavel } = request.query
    const returnName = produtos.filter(resp => resp.responsavel === responsavel)
    console.log(responsavel)
    console.log(returnName)
    return response
        .status(200)
        .json(returnName)
    
})


app.listen(3333, () => {
    console.log('Servidor funcionando!!!')
})