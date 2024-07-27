

const botaoJogar = document.getElementById('jogar');
// Abre a página de jogo ao clicar no botão "jogar"
botaoJogar.onclick = function(){
    const nomeBingo = document.getElementById('nome-bingo').value;

    // Armazena o valor do nome escolhido no localStorage
    localStorage.setItem('nomeBingo', nomeBingo);
    window.location.href="jogo.html";
}


function sorteio(){
    //alert('Funcionou!');
    const numeroMostrado = document.getElementById('numero-sorteado');
    numeroMostrado.setAttribute('class','border border-primary rounded-circle p-3');
    
    const numeroSorteado = Math.floor(Math.random() * 90) + 1; // Gera um número entre 1 e 90
    numeroMostrado.textContent = numeroSorteado > 9 ? numeroSorteado : '0' + numeroSorteado; // Atualiza o texto do h1
    // a função "includes()" checa se o elemento está no array. Retorna true or false
}

function teste(){
    alert('Teste');
}
