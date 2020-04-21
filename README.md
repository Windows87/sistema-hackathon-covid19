# Sistema Hackathon Covid-19 IFSULDEMINAS

Sistema utilizado para cadastro de ideias e formação de equipes durante o <a href="https://portal.ifsuldeminas.edu.br/index.php/ultimas-noticias-ifsuldeminas/80-noticias-da-pppi/3492-hackathon-desafio-covid-19">Hackathon Covid-19 do IFSULDEMINAS</a>. O sistema foi desenvolvido com HTML, CSS, JavaScript, NodeJS, Socket.io e MySQL.

## Screenshots
<div>
  <img src="https://raw.githubusercontent.com/Windows87/sistema-hackathon-covid19/master/screenshots/desktop-1.png" width="25%">
  <img src="https://raw.githubusercontent.com/Windows87/sistema-hackathon-covid19/master/screenshots/desktop-2.png" width="25%">
  <img src="https://raw.githubusercontent.com/Windows87/sistema-hackathon-covid19/master/screenshots/desktop-3.png" width="25%">
  <img src="https://raw.githubusercontent.com/Windows87/sistema-hackathon-covid19/master/screenshots/mobile-1.png" width="20%">
</div>

## Como funciona
- Alguém faz o cadastro de uma ideia;
- Essa ideia é liberada para que usuários possam entrar no time utilizando o Nome Completo e o CPF;
- Um time pode ser composto por no máximo 6 pessoas;
- Você pode fechar clicando no botão encerrar e colocando a senha "123456".

## Como rodar
1. Faça o clone do repositório;
2. Abra o MySQL;
3. Faça o import do banco "hackathon" que está em sql.sql;
4. Instale os módulos e inicie:
```bash
# Instale os módulos
npm install
# Inicie
npm start
```
5. O sistema estará disponível em http://localhost:82

