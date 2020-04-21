const express = require('express');
const http = require('http');
const socket = require('socket.io');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hackathon'
});

let stopped = false;

connection.connect();

app.use(express.static('public'));
app.use(cors());

const server = http.createServer(app);
const io = socket(server);

function getPeople(connection, ideaId) {
  return new Promise(async (next, reject) => {
    connection.query(`SELECT * from pessoas WHERE ideias_id_ideia=${ideaId}`, (error, results) => {
      if(error) return reject(error);
      next(results);
    });
  });  
}

function getPerson(connection, cpf) {
  return new Promise(async (next, reject) => {
    connection.query(`SELECT * from pessoas WHERE cpf=${cpf}`, (error, results) => {
      if(error) return reject(error);
      next(results[0]);
    });
  });  
}

function getPerson(connection, cpf) {
  return new Promise(async (next, reject) => {
    connection.query(`DELETE FROM pessoas WHERE cpf=${cpf}`, (error, results) => {
      if(error) return reject(error);
      next();
    });
  });  
}

function getIdeas(connection) {
  return new Promise(async (next, reject) => {
    connection.query(`SELECT * from ideias`, async (error, results) => {
      if(error) return reject(error);

      results = await Promise.all(results.map(async result => {
        try {
          const people = await getPeople(connection, result.id_ideia);
          result.time = people;
          return result;
        } catch(error) {
          reject(error);
        }
      }));

      next(results);
    });
  });    
}

function newIdea(connection, { author, description }) {
  return new Promise(async (next, reject) => {
    connection.query(`INSERT INTO ideias (nome_autor, descricao_ideia) VALUES ('${author}', '${description}')`, (error, results) => {
      if(error) return reject(error); 
      next(results.insertId);
    });
  });   
}

function newPerson(connection, { name, cpf, ideaId }) {
  return new Promise(async (next, reject) => {
    connection.query(`INSERT INTO pessoas (nome, cpf, ideias_id_ideia) VALUES ('${name}', '${cpf}', '${ideaId}')`, error => {
      if(error) return reject(error);
      next();
    });
  });   
}

io.on('connection', socket => {
  socket.on('start', async () => {
    try {
      const ideas = await getIdeas(connection);
      socket.emit('ideas', ideas);
      socket.emit('is-stopped', stopped);
    } catch(error) {
      console.log(error);
      socket.emit('erro', 'Erro ao Obter Lista de Ideias');      
    }
  });

  socket.on('create-ideia', async object => {
    if(stopped)
      return socket.emit('erro', 'Tempo Encerrado');

    try {
      const { author, description } = object.idea;
      const { name, cpf } = object.person;

      const personAlreadyExists = await getPerson(connection, cpf);

      if(personAlreadyExists)
        await deletePerson(connection, cpf);
      
      const ideaId = await newIdea(connection, { author, description });
      await newPerson(connection, { name, cpf, ideaId });
      const ideas = await getIdeas(connection);

      socket.emit('enter-idea');
      io.sockets.emit('ideas', ideas);
    } catch(error) {
      console.log(error);
      socket.emit('erro', 'Erro ao Criar Ideia'); 
    }
  });

  socket.on('select-ideia', async object => {
    if(stopped)
      return socket.emit('erro', 'Tempo Encerrado');

    try {
      const { name, cpf, idea } = object;

      const ideaTeam = await getPeople(connection, idea);
      const personAlreadyExists = await getPerson(connection, cpf);

      if(ideaTeam.length === 6)
        return socket.emit('erro', 'O Time já está Composto por 6 Membros');

      if(personAlreadyExists)
        await deletePerson(connection, cpf);
    
      await newPerson(connection, { name, cpf, ideaId: idea });
      const ideas = await getIdeas(connection);

      socket.emit('enter-idea');
      io.sockets.emit('ideas', ideas);
    } catch(error) {
      console.log(error);
      socket.emit('erro', 'Erro ao Obter Entrar na Equipe'); 
    }
  }); 
  
  socket.on('stop', password => {
    if(password === '123456') {
      stopped = true;
      return io.sockets.emit('stopped');
    }

    socket.emit('erro', 'Senha Errada'); 
  });
});

server.listen(83, () => console.log('Socket on port 83'));
app.listen(82, () => console.log('Listening on port 82'));