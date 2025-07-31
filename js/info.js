function info() {
    $.alert({
        title: "Informação Ficha Skyfall!",
        content: `
        <p>Para usar este site de ficha, basta preenche-la e clicar no botão <button type="button" class="save-button">SALVAR</button>,
        assim você salva sua ficha localmente no link posto na página, só adicionar nos seus favoritos.
        <strong>Cuidado para não ter personagens com o mesmo nome, é assim que eles são diferenciados no armazenamento!!</strong><br><br>
        Caso queira mover a ficha de um dispositivo para o outro ou ter um backup, basta clicar no botão <button type="button" class="save-button">EXPORTAR</button>
        e você baixara o .json da ficha. Basta então, clicar, no outro dispositivo, o botão <button type="button" class="clear-button">CARREGAR</button>
        e fazer upload do .json que a ficha carregara.</p>

        <p>Problemas ou interesse em entender tecnicamente o site?
        Veja o <a href="https://github.com/MAML8/Ficha-Skyfall">repositório do github</a></p>
        `
    });
}

$("#info-button").on('click', info);