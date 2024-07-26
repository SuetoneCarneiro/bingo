
const botaoJogar = document.getElementById('jogar');

// Abre a página de jogo ao clicar no botão "jogar"
botaoJogar.onclick = function(){
    const nomeBingo = document.getElementById('nome-bingo').value;

    // Armazena o valor do nome escolhido no localStorage
    localStorage.setItem('nomeBingo', nomeBingo);
    window.location.href="jogo.html";
}
