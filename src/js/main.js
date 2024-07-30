
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