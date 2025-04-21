
const clearButton = document.querySelector('.clear-button');
const form = document.getElementById('character-sheet');

clearButton.addEventListener('click', function(event) {
    event.preventDefault(); // Previne o reset imediato
    if (confirm('Tem certeza que deseja limpar todos os campos da ficha?')) {
        form.reset(); // Efetua o reset do formulário
    }
});

// Exemplo MUITO BÁSICO de como adicionar save/load com Local Storage (Não incluído por padrão)
/*
function saveData() {
    const formData = new FormData(form);
    for (let [key, value] of formData.entries()) {
        localStorage.setItem(key, value);
    }
    console.log("Data saved to Local Storage");
}

function loadData() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const element = form.elements[key];
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = localStorage.getItem(key) === 'on'; // FormData retorna 'on' para checkboxes
            } else {
                element.value = localStorage.getItem(key);
            }
        }
    }
    console.log("Data loaded from Local Storage");
}

// Adicionar botões ou eventos para chamar saveData() e loadData()
// Exemplo: window.addEventListener('load', loadData); // Carrega ao abrir
// Exemplo: form.addEventListener('change', saveData); // Salva a cada mudança (pode ser pesado)
*/

$('#mais-aptidao').on("click", function(e){
    let quant_aptidao = Math.round($('#quant-aptidao').val());
    $(this).before('<div class="skill-entry">'+
        '<input type="checkbox" name="prof-aptidao'+quant_aptidao+'" id="prof-aptidao'+quant_aptidao+'">'+
        '<label for="val-aptidao'+quant_aptidao+'">Aptidão (<input type="text" size=10>):</label>'+
        '<button type="button" class="edit" name="menos-aptidao'+quant_aptidao+'" id="menos-aptidao'+quant_aptidao+'">-</button>'+
        '<input type="number" name="val-aptidao'+quant_aptidao+'" id="val-aptidao'+quant_aptidao+'">'+
        '</div>');
    $("#menos-aptidao"+quant_aptidao).on("click", function(e){
        $(this).parent().remove();
        $('#quant-aptidao').val(Math.round($('#quant-aptidao').val())-1)
    });
    $('#quant-aptidao').val(quant_aptidao+1);
});

$('#mais-ataque').on("click", function(e){
    let quant_ataques = Math.round($('#quant-ataque').val())+1;
    $(this).parent().before('<div class="attack-entry">'+
        '<input type="text" name="atk'+quant_ataques+'-nome">'+
        '<input type="text" name="atk'+quant_ataques+'-bonus" size="5">'+
        '<input type="text" name="atk'+quant_ataques+'-dano" size="10">'+
        '<button type="button" name="atk'+quant_ataques+'-roll">roll</button>'+
        '<button type="button" class="edit" name="atk'+quant_ataques+'-menos" id="atk'+quant_ataques+'-menos">-</button>'+
    '</div>');
    $('#atk'+quant_ataques+'-menos').on("click", function (e) {
        $(this).parent().remove();
        $('#quant-ataque').val(Math.round($('#quant-ataque').val())-1);
    });
    $('#quant-ataque').val(quant_ataques);
});

$('#mais-item').on('click', function(e) {
    let quant_itens = Math.round($('#quant-item').val())+1;
    $(this).parent().before('<div class="inventory-item">'+
                '<input type="text" name="item'+quant_itens+'-nome" placeholder="Nome do item">'+
                '<input type="number" name="item'+quant_itens+'-vol" class="small-input">'+
                '<input type="number" name="item'+quant_itens+'-frag" class="small-input">'+
                '<input type="text" name="item'+quant_itens+'-desc" placeholder="Descrição...">'+
                '<button class="edit" type="button" name="menos-item'+quant_itens+'" id="menos-item'+quant_itens+'">-</button>'+
            '</div>');
    $('#menos-item'+quant_itens).on('click', function(e){
        $(this).parent().remove();
        $('#quant-item').val(Math.round($('#quant-item').val())-1);
    })
    $('#quant-item').val(quant_itens);
});

$('.mais-habilidade').on("click", function(e){
    $.alert({
        title: 'Teste',
        content: 'bob'
    });
});