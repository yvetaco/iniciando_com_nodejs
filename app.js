const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { request } = require("http");

const app = express();

app.use(express.json())

let products = [];


fs.readFile("products.json","utf-8", (err, data) => {
    if(err){
        console.log(err);
    }else {
        products = JSON.parse(data);
    }
})

app.post("/products", (request, response) => {
    const { name, price } = request.body;

    const product = {
        name, 
        price,
        id: randomUUID(),
    }

    products.push(product);

    createProductFile()

    console.log(product.id, product.name, product.price);

    return response.json(product);
});

app.get("/products", (request, response) => {
    return response.json(products);
});
app.get("/products/:id", (request, response) => {
    const { id } = request.params;
    const product = products.find((product) => product.id === id);
    if(product == undefined) {
        return response.json({}, 404)
    }
    return response.json(product);
});

app.put("/products/:id", (request, response) => {
    const { id } = request.params;
    const { name, price } = request.body;
    const productIndex = products.findIndex(product => product.id === id);
    products[productIndex] = {
        ...products[productIndex],
        price,
        name
    }
    createProductFile()

    if (productIndex == -1) {
        return response.json({ message: "producto con el ID " + id + " no existe! SAPO CAGON" }, 404)
    }
    console.log(productIndex)
    return response.json({ message: "producto alterado con exito" })
})

app.delete("/products/:id", (request, response) => {
    const { id } = request.params;
    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex == -1) {
        return response.json({ message: "producto con el ID " + id + " no existe. MO SE PUEDE ELIMINAR! SAPO CAGON" }, 404)
    }
    
    products.splice(productIndex, 1);

    produtfile();

    return response.json({ message: "Producto eliminado con exito!" })
})

function produtfile(){
    fs.writeFile("products.json",  JSON.stringify(products), (err) => {
        if (err){
            console.log(err);
        }else {
            console.log("producto inserido")
        }
    })   
}

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"));
