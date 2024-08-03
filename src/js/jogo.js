

const botaoJogar = document.getElementById('jogar');
// Abre a página de jogo ao clicar no botão "jogar"
botaoJogar.onclick = function () {
    const nomeBingo = document.getElementById('nome-bingo').value;

    // Armazena o valor do nome escolhido no localStorage
    localStorage.setItem('nomeBingo', nomeBingo);
    window.location.href = "jogo.html";
}

function sorteio() {
    const numeroMostrado = document.getElementById('numero-sorteado');
    const numeroAnterior = document.getElementById('numero-anterior');
    numeroMostrado.setAttribute('class', 'border border-primary rounded-circle p-3');
    // Lógica da animação do sorteio
    let animacao;
    animacao = setInterval(() => {
        numeroSorteado = Math.floor(Math.random() * 90) + 1;
        if(numerosSorteados.includes(numeroSorteado)){// a função "includes()" checa se o elemento está no array. Retorna true or false
        while(numerosSorteados.includes(numeroSorteado)) numeroSorteado = Math.floor(Math.random() * 90) + 1;
    }
        
        numeroMostrado.textContent = numeroSorteado > 9 ? numeroSorteado : '0' + numeroSorteado; // Atualiza o texto do h1

    }, 25);
    setTimeout(() => {clearInterval(animacao)}, 500);

    numerosSorteados.push(numeroSorteado);
    
    if(numerosSorteados.length > 1){
        if(numeroSorteado > 9) numeroAnterior.textContent = 'Último número sorteado: ' + numerosSorteados[numerosSorteados.length-1];
        else numeroAnterior.textContent = 'Último número sorteado: 0' + numerosSorteados[numerosSorteados.length-1]; 
    }
    console.log(numerosSorteados);
    
}

function showNumbers(){
    const modal = document.querySelector('.pagina-sorteados');
    const closeModal = document.querySelector('.botao-modal');
    const listaNumeros = document.querySelector('#lista-numeros');
    const qtd = document.getElementById('qtd-numeros');

    modal.showModal();
    let show = '';
    numerosSorteados.map((number) => {
        if(number != 0){
            if(number > 9) show += `${number}`;
            else show += `0${number}`;
            let lastElement = numerosSorteados.slice(-1);
            if(number != lastElement) show += ', ';
        }
        
    }).join('');
    
    listaNumeros.textContent = show;
    if(numerosSorteados.length > 1)
        qtd.textContent = (numerosSorteados.length - 1) + ' números foram sorteados até o momento... Guenta coração...'
    closeModal.addEventListener('click', function(){modal.close();})
    
}
function teste() {
    alert('Teste');
}
