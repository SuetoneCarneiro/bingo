// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const main = document.querySelector('html');
const botaoInscrucoes = document.getElementById('instrucoes');
const modal = document.querySelector('dialog');
const buttonClose = document.querySelector('dialog button');

botaoInscrucoes.onclick = function(){instrucoes()};

function instrucoes(){
    modal.showModal();
}

buttonClose.onclick = function(){
    modal.close();
}