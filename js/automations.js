function bonus_de_proficiência(){
    return 2 + Math.floor(($("#char-level").val()-1) / 4);
}

function roll_d(num){
    return Math.floor(Math.random() * num) + 1;
}

$("#char-level").on("change", function(){
    $("#bonus-prof").val(bonus_de_proficiência());
});

function on_change_vol(){
    let sumEntries = 0;
    $('input[name="item-vol[]"]').each(function(){
        sumEntries += Math.round($(this).val());
    });
    $("#carga-atual").val(sumEntries);

    if(sumEntries>$("#carga-limite").val()){
        $("#carga-atual").css("color", "red");
    } else {
        $("#carga-atual").css("color", "#333");
    }
}

function on_change_frag(){
    let sumEntries = 0;
    $('input[name="item-frag[]"]').each(function(){
        sumEntries += Math.round($(this).val());
    });
    $("#frag-atual").val(sumEntries);

    if(sumEntries>$("#frag-limite").val()){
        $("#frag-atual").css("color", "red");
    } else {
        $("#frag-atual").css("color", "#333");
    }
}

$(".inventory-detailed").on("change", ".vol-entries", on_change_vol);

$(".inventory-detailed").on("change", ".frag-entries", on_change_frag);

const atributos = ["for", "des", "con", "int", "sab", "car"];

function confirmar_calc(titulo, content, calc){
    $.confirm({
        title: titulo,
        content: content,
        buttons:{
            cancel: function(){},
            formSubmit:{
                text: "Calcular",
                btnClass: "btn-green",
                action: calc
            }
        }
    });
}

$("#calc-prot").on('click', function() {
    confirmar_calc("Calcular Proteções",
        `<p>As proteções serão calculadas com base nos atributos preenchidos e proficiências marcadas.<br>
        Para valores adicionais preencher a seguir (Deixar vazio caso contrário):</p>
        <form action="">
            <label for="rd-escudo">Estilo de Combate com escudo (rd do escudo):</label> <input type="number" name="rd-escudo">
        </form>`,
        function(){
            for(let i = 0; i<6; i++){
                let prot = 10;
                prot += Number($("#attr-"+atributos[i]).val());
                if($("#prof-prot-"+atributos[i]).prop("checked")){
                    prot += bonus_de_proficiência();
                }
                if(i<3){
                    prot += Number(this.$content.find('input[name="rd-escudo"]').val());
                }
                $("#prot-"+atributos[i]).val(prot);
            }
        })
});

$("#calc-vida").on('click', function(){
    confirmar_calc("Calcular Vida",
        `<p>Vida será calculada com base na CON preenhida:</p>
        <form action="" class="form-confirm">
            <div><label for="first-class">Primeira Classe</label> <select name="first-class"><option value="c">Combatente</option><option value="e">Especialista</option><option value="o">Ocultista</option></select></div>
            <p>Modo do calculo de NÍVEIS SEGUINTES:<p>
            <div><input type="radio" value="comum" id="comum" name="calc-type" checked> <label for="comum">Valor fixo</label></div>
            <div><input type="radio" value="rolagem" id="rolagem" name="calc-type"> <label for="rolagem">Rolagem</label></div>
            <div><label for="combatente">Nv. Combatente</label> <input name="combatente" type="number" value=0></div>
            <div><label for="especialista">Nv. Especialista</label> <input name="especialista" type="number" value=0></div>
            <div><label for="ocultista">Nv. Ocultista</label> <input name="ocultista" type="number" value=0></div>
            
            <div><label for="tora">Tôra?</label> <input type="checkbox" name="tora"></div>
            <div><label for="aethe">Aetheridium?</label> <input type="checkbox" name="aethe"></div>
            <div><label for="ances-drag">Trilha Herdeiro Ancestral Dracônico?</label> <input type="checkbox" name="ances-drag"></div>
            <div><label for="bencao">Benção Corpo São e Mente Sã?</label> <input type="checkbox" name="bencao"></div>
        </form>`,
        function(){
            const con = Number($("#attr-con").val());
            let result = 0;
            if (this.$content.find('select').val()=="c"){
                result = 10;
            } else if(this.$content.find('select').val()=="e"){
                result = 8;
            } else {
                result = 6;
            }

            let nvTotal = 1, nvAtual, aditivo;
            const rolagem = this.$content.find('[name="calc-type"]:checked').val() == "rolagem";
            nvAtual = Number(this.$content.find('[name="combatente"]').val());
            nvTotal += nvAtual;
            aditivo = !rolagem ? 6 : roll_d(10);
            result += aditivo * nvAtual;

            nvAtual = Number(this.$content.find('[name="especialista"]').val());
            nvTotal += nvAtual;
            aditivo = !rolagem ? 5 : roll_d(8);
            result += aditivo * nvAtual;

            nvAtual = Number(this.$content.find('[name="ocultista"]').val());
            nvTotal += nvAtual;
            aditivo = !rolagem ? 4 : roll_d(6);
            result += aditivo * nvAtual;

            result += nvTotal * con;
            
            if(this.$content.find('[name="tora"]').prop("checked")){
                result += 2 + nvTotal;
            }
            if(this.$content.find('[name="aethe"]').prop("checked")){
                result += 2 + nvTotal;
            }
            if(this.$content.find('[name="ances-drag"]').prop("checked")){
                result += Number($('#attr-'+$("#magic-attr").val()).val());
            }
            if(this.$content.find('[name="bencao"]').prop("checked")){
                result += nvTotal;
            }

            $('input[name="pv-maximos"]').val(result);
        }
    )
})