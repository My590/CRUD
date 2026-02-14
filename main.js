'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => document.getElementById('modal')
    .classList.remove('active')

const getLocalStorage = () => {
    try {
        const dbClient = JSON.parse(localStorage.getItem('db_client'));
        return Array.isArray(dbClient) ? dbClient : [];  // Retorna um array vazio se o valor não for um array
    } catch (error) {
        return [];  // Retorna um array vazio em caso de erro
    }
}

const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))


// crud = criar, ler, atualizar e deletar
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    console.log("Antes de adicionar o cliente:", dbClient)  // Verificando os dados antes
    dbClient.push(client)
    console.log("Depois de adicionar o cliente:", dbClient)  // Verificando após adicionar
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

// interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    console.log("Salvar clicado!")  // Verificando se a função está sendo chamada
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }

        const index = document.getElementById('nome').dataset.index
        if(index == 'new') {
       
        createClient(client)
        closeModal()
        }
        else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

// Agora a função createRow recebe o parâmetro 'index'
const createRow = (client, index) => {  
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">editar</button>
            <button type="button" class="button red" id="delete-${index}">excluir</button>
        </td>
    `;
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

// Alterando updateTable para passar o índice para createRow
const updateTable = () => {
    const dbClient = readClient();
    dbClient.forEach((client, index) => {  // Passando 'index' como segundo parâmetro
        createRow(client, index);
    });
};

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient() [index]
    client.index = index
    fillFields (client)
    openModal()
}

const editDelete = (event) =>{
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action =='edit') {
            editClient(index)
        }
        else {
            const client = readClient() [index]
            const response = confirm(`deixa realmente excluir ${client.nome}`)
            if ( response) {
                deleteClient(index)
                updateTable()    
            }
        }
    }
}

updateTable()

// eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)