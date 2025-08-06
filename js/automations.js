const PERICIAS = ["apresentacao", "arcanismo", "cultura", "diplomacia", "doutrinas", "furtividade",
                "intimidacao", "intuicao", "magitec", "malandragem", "manipulacao", "medicina", "natureza",
                "percepcao", "preparo"];

function bonus_de_proficiência(){
    return 2 + Math.floor(($("#char-level").val()-1) / 4);
}

function attr_de_conjuração(){
    return Number($('#attr-'+$("#magic-attr").val()).val());
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

$("#inventory").on("change", ".vol-entries", on_change_vol);

$("#inventory").on("change", ".frag-entries", on_change_frag);

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
            <div><label for="aethe">Aetherideo?</label> <input type="checkbox" name="aethe"></div>
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
                result += attr_de_conjuração();
            }
            if(this.$content.find('[name="bencao"]').prop("checked")){
                result += nvTotal;
            }

            $('input[name="pv-maximos"]').val(result);
        }
    )
});

$("#calc-limites").on('click', calc_limites);

function calc_limites(){
    confirmar_calc("Calcular Limites de Carga e Fragmentos Arcanos",
        `<p>Limites serão calculados conforme For e Car preenchidos</p>
        <p>Em casos de informações preencher a seguir:</p>
        <form action="" class="form-confirm">
            <p>Carga</p>
            <div><label for="vendedor">Trilha Vendedor Ambulante?</label><input type="checkbox" name="vendedor" id="vendedor"></div>
            <div><label for="jotun">Jotun?</label><input type="checkbox" name="jotun" id="jotun"></div>
            <div><label for="andarilho">Talento Caminho do Andarilho? (de Humani)</label><input type="checkbox" name="andarilho" id="andarilho"></div>
            <div><label for="esp-extra">Talento Espaço Extra? (de Artesão de Guilda)</label><input type="checkbox" name="esp-extra" id="esp-extra"></div>

            <p>Fragmentos</p>
            <div><label for="acumulador">Talento Acumulador de Fragmentos? (de Magitécnico)</label><input type="checkbox" name="acumulador" id="acumulador"></div>
            <div><label for="porrada">Talento Porrada Mágica? (de Pugilista)</label><input type="checkbox" name="porrada" id="porrada"></div>
        </form>`,
        function(){
            let quo = Number($("#attr-for").val());
            if(this.$content.find("#vendedor").prop("checked")){
                quo = Math.max(quo, attr_de_conjuração());
                quo += bonus_de_proficiência();
            }
            if(this.$content.find("#andarilho").prop("checked")){
                if(this.$content.find("#jotun").prop("checked")){
                    $.alert("Como assim você é um Jotun com talento de Humani!!??? >:(");
                    calc_limites();
                    return;
                }
                quo += 3;
            }
            let lim = 16 + (quo >= 0 ? quo * 3 : quo * 2);
            if(this.$content.find("#jotun").prop("checked")) lim += 5;
            if(this.$content.find("#esp-extra").prop("checked")) lim += bonus_de_proficiência();

            $("#carga-limite").val(lim);

            quo = Number($("#attr-car").val());
            if(this.$content.find("#acumulador").prop("checked")){
                quo = Math.max(quo, attr_de_conjuração());
            }
            if(this.$content.find("#porrada").prop("checked")){
                quo = Math.max(quo, Number($("#attr-for").val()), Number($("#attr-con").val()));
            }
            lim = quo + bonus_de_proficiência() * 2;
            $("#frag-limite").val(lim);
        }
    );
}

function prof_img(prof){
    switch(prof){
        case 0:
            return "imgs/proficiencia/None.png";
        case 1:
            return "imgs/proficiencia/Prof.png";
        case 2:
            return "imgs/proficiencia/Exp.png";
        default:
            console.error("Bruh");
            return "imgs/Simbolo Habilidades/Tabela Necromante.png";
    }
}

$("#skill-list").on("click", ".prof-icon", function(){
    const $img = $(this);
    const $prof = $img.parent().find('.prof-indicator');
    let new_prof = Number($prof.val());
    if(Number.isNaN(new_prof))
        new_prof = -1;
    
    new_prof++;
    new_prof %= 3;
    $prof.val(new_prof);
    $img.attr("src", prof_img(new_prof));
});