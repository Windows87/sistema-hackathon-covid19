let creatingIdea = false;
let selectedId;
let items = [];

const userModal = new Modal({ elementQuery: '#user-modal', onClose: () => creatingIdea = false });
const stopModal = new Modal({ elementQuery: '#stop-modal' });

const tableItems = document.querySelector('#table-items');
const stopButton = document.querySelector('#stop-button');
const userForm = document.querySelector('#user-form');

const personForm = document.querySelector('#person-form');
const stopForm = document.querySelector('#stop-form');

const authorInput = document.querySelector('#name');
const descriptionInput = document.querySelector('#description');
const nameInput = document.querySelector('#fullname');
const cpfInput = document.querySelector('#cpf');
const stopInput = document.querySelector('#password');
const personFormSubmitButton = document.querySelector('#person-form input[type="submit"]');

VMasker(cpfInput).maskPattern("999.999.999-99");

const socket = io('http://localhost:83');

String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

function createTableItem({ id_ideia, nome_autor, descricao_ideia, time }) {
  const tableItem = document.createElement('div');
  const tableData = document.createElement('div');
  const tableTeamContainer = document.createElement('div');
  const tableTeam = document.createElement('div');

  const idSpan = document.createElement('span');
  const authorSpan = document.createElement('span');
  const descriptionSpan = document.createElement('span');
  const button = document.createElement('button');

  tableItem.classList.add('table-item');
  tableData.classList.add('table-data');
  tableTeamContainer.classList.add('table-team-container');
  tableTeam.classList.add('table-team');

  idSpan.innerText = id_ideia;
  authorSpan.innerText = nome_autor;
  descriptionSpan.innerText = descricao_ideia;
  button.innerText = 'Ingressar neste Projeto';

  const names = [];

  time.forEach(person => names.push(person.nome));

  tableTeam.innerText = `Equipe: ${names.toString().replaceAll(',', ', ')}`;

  const teamReachedLimit = time.length === 6;

  if(teamReachedLimit) {
    button.disabled = true;
    button.classList.add('button-disabled');
  }

  button.addEventListener('click', () => {
    selectedId = id_ideia;
    userModal.open();
  });

  tableTeamContainer.appendChild(tableTeam);

  tableData.appendChild(idSpan);
  tableData.appendChild(authorSpan);
  tableData.appendChild(descriptionSpan);
  tableData.appendChild(button);

  tableItem.appendChild(tableData);
  tableItem.appendChild(tableTeamContainer);

  return tableItem;
}

function disableAllButtons() {
  const buttons = document.querySelectorAll('input[type="submit"], button');

  buttons.forEach(button => {
    button.disabled = true;
    button.style['color'] = 'white';
    button.classList.add('button-disabled');
  });
}

function setFormToNormal() {
  personFormSubmitButton.disabled = false;
  personFormSubmitButton.value = 'Ingressar';
  creatingIdea = false;
  if(userModal.isOpen()) userModal.close();
}

function setTableItems() {
  tableItems.innerHTML = '';
  items.forEach(item => tableItems.appendChild(createTableItem(item)));
}

socket.emit('start');

socket.on('ideas', ideas => {
  items = ideas;
  setTableItems();
});

socket.on('enter-idea', setFormToNormal);

socket.on('erro', error => {
  if(error === 'O Time já está Composto por 6 Membros')
    setFormToNormal();
    
  alert(error);
});

socket.on('is-stopped', isStopped => isStopped ? disableAllButtons() : null);
socket.on('stopped', () => {
  if(stopModal.isOpen()) stopModal.close();
  disableAllButtons();
});

stopButton.addEventListener('click', () => stopModal.open());

userForm.addEventListener('submit', event => {
  event.preventDefault();
  creatingIdea = true;
  userModal.open();
});

personForm.addEventListener('submit', event => {
  event.preventDefault();

  personFormSubmitButton.disabled = true;
  personFormSubmitButton.value = 'Ingressando..';

  const author = authorInput.value;
  const description = descriptionInput.value;
  const name = nameInput.value;
  const cpf = VMasker.toPattern(cpfInput.value, '99999999999');

  if(creatingIdea)
    socket.emit('create-ideia', { idea: { author, description }, person: { name, cpf } });
  else
    socket.emit('select-ideia', { name, cpf, idea: selectedId });
});

stopForm.addEventListener('submit', event => {
  event.preventDefault();
  socket.emit('stop', stopInput.value);
});