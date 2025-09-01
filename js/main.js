
function aptidao_entry(){
    return `<div class="skill-entry">
        <img src="imgs\\proficiencia\\None.png" class="prof-icon">
        <input type="hidden" class="prof-indicator" name="prof-aptidao[]" value="0">
        <label for="val-aptidao">Aptidão (<input type="text" size=10 name="nome-aptidao[]">):</label>
        <button type="button" class="edit" name="menos-skill">-</button>
        <input type="number" name="val-aptidao[]">
    </div>`
}

function new_aptidao(value){
    let $new;
    if($('input[name="nome-aptidao[]"]').first().val() == ""){
        $new = $('input[name="nome-aptidao[]"]').first().parent();
    } else{
        $new = $(aptidao_entry());
        $("#mais-aptidao").before($new);
    }

    $new.find('input[name="prof-aptidao[]"]').val(value.prof);
    $new.find('.prof-icon').attr("src", prof_img(Number(value.prof)));
    $new.find('input[name="nome-aptidao[]"]').val(value.nome);
    $new.find('input[name="val-aptidao[]"]').val(value.val);
}

$('#mais-aptidao').on("click", function(e){
    $(this).before(aptidao_entry());
});
$("#skill-list").on('click', '[name="menos-skill"]', function(){
    $(this).closest('.skill-entry').remove();
});

function attack_entry(){
    return `<div class="attack-entry">
        <input type="text" name="atk-nome[]">
        <input type="text" name="atk-bonus[]" size="5">
        <input type="text" name="atk-dano[]" size="10">
        <button type="button" class="atk-roll">roll</button>
        <button type="button" class="edit" name="atk-menos">-</button>
    </div>
    `
}

function new_attack(value){
    let $newRow = $(".attack-entry").first();
    if($newRow.find('input[name="atk-nome[]"]').val() != ""){
        $newRow = $(".attack-entry").not($newRow).first();
    }
    if($newRow.find('input[name="atk-nome[]"]').val() != ""){
        $newRow = $(attack_entry());
        $("#mais-ataque").parent().before($newRow);
    }

    $newRow.find('input[name="atk-nome[]"]').val(value.nome);
    $newRow.find('input[name="atk-bonus[]"]').val(value.bonus);
    $newRow.find('input[name="atk-dano[]"]').val(value.dano);
}

$('#mais-ataque').on("click", function(e){
    $(this).parent().before(attack_entry());
});
$('.attacks').on("click", 'button[name="atk-menos"]', function(){
    $(this).closest(".attack-entry").remove();
});

function inventory_entry(){
    return `<div class="inventory-item">
                <input type="text" name="item-nome[]" placeholder="Nome do item">
                <input type="number" name="item-vol[]" class="vol-entries">
                <input type="number" name="item-frag[]" class="frag-entries">
                <input type="text" name="item-desc[]" placeholder="Descrição...">
                <button type="button" class="edit" name="menos-item">-</button>
            </div>`;
}

function new_item(value){
    let $newRow = $(".inventory-item").first();
    if($newRow.find('input[name="item-nome[]"]').val() != ""){
        $newRow = $(".inventory-item").not($newRow).first();
    }
    if($newRow.find('input[name="item-nome[]"]').val() != ""){
        $newRow = $(inventory_entry());
        $("#mais-item").parent().before($newRow);
    }

    $newRow.find('input[name="item-nome[]"]').val(value.nome);
    $newRow.find('input[name="item-vol[]"]').val(value.vol);
    $newRow.find('input[name="item-frag[]"]').val(value.frag);
    $newRow.find('input[name="item-desc[]"]').val(value.desc);
}

$('#mais-item').on('click', function(e) {
    $(this).parent().before(inventory_entry());
});
$('#inventory').on('click', 'button[name="menos-item"]', function(){
    $(this).closest('.inventory-item').remove();
});

function ação_img(nome) {
    switch (nome) {
        case "ação":
            return '<img src="imgs/Simbolo Habilidades/Ação.png" class="icon">';
        case "bônus":
            return '<img src="imgs/Simbolo Habilidades/Ação bônus.png" class="icon">';
        case "livre":
            return '<img src="imgs/Simbolo Habilidades/Ação livre.png" class="icon">';
        case "reação":
            return '<img src="imgs/Simbolo Habilidades/Reação.png" class="icon">';
        case "mais":
            return '<img src="imgs/Simbolo Habilidades/+Ações.png" class="icon">';
        default:
            return '<p>Deu ruim</p>';
    }
}

function descritores(tags){
    tags = tags.replaceAll(" ", "");
    let array = tags.split(",");
    let retorno = '';
    array.forEach(element => {
        switch(element.toUpperCase()){
            case "ÍGNEO":
                retorno += '<span class="tag tag-igneo">'
            break;
            default:
                retorno += '<span class="tag">';
            break;
        }
        retorno += element.toUpperCase()+'</span>';
    });
    return retorno;
}

function nova_habilidade(onde, content, elimina=false){
    if(!content || content['nome'] == ""){
        if(elimina) onde.remove();
        return;
    }
    
    const save = JSON.stringify(content);

    let card = '<div class="ability-card"> <div class="ability-header">'+
                    '<span class="icon">'+ação_img(content['action'])+'</span>'+
                    '<span class="ability-name">'+content['nome']+'</span>'+
                    ((content['pe']>0) ? ('<span class="ability-cost">'+content['pe']+' PE</span>') : '')+
                    '<span class="edit-ability"><button type="button" class="edit-habilidade">edit</button>'+
                    '<input type="hidden" value="'+save.replaceAll("\"", "||")+'" name="saved-ability[]" class="saved-ability"> </span>'+
                '</div>'+
                '<div class="ability-tags">'+
                    descritores(content['tags'])+
                '</div>'+
                '<div class="ability-body">'+
                    ((content['alcance'] != "") ? ('<p><strong>Alcance: </strong>'+ content['alcance']+'</p>') : '')+
                    ((content['alvo'] != "") ? ('<p><strong>Alvo: </strong>'+ content['alvo']+'</p>') : '')+
                    ((content['duracao'] != "") ? ('<p><strong>Duração: </strong>'+ content['duracao']+'</p>') : '')+
                    ((content['ataque'] != "") ? ('<p><strong>Ataque: </strong>'+ content['ataque']+'</p>') : '')+
                    ((content['gatilho'] != "") ? ('<p><strong>Gatilho: </strong>'+ content['gatilho']+'</p>') : '')+
                    '<h3> </h3>'+
                    ((content['acerto'] != "") ? ('<p><strong>Acerto: </strong>'+ content['acerto']+'</p>') : '')+
                    ((content['erro'] != "") ? ('<p><strong>Erro: </strong>'+ content['erro']+'</p>') : '')+
                    ((content['efeito'] != "") ? ('<p><strong>Efeito: </strong>'+ content['efeito']+'</p>') : '')+
                    ((content['especial'] != "") ? ('<p><strong>Especial: </strong>'+ content['especial']+'</p>') : '')+
                '</div>';
    content.modificacoes.forEach(function(mod){
        card += `<div class="ability-upgrade"
                    <span class="icon">▷</span>
                    <span class="upgrade-cost">+${mod.custo != '' ? mod.custo : 0} ${mod.p}</span>
                    <span class="upgrade-type">[${mod.modifica.toUpperCase()}]</span>`;
        if(mod.nome!='') card += ` <span class="upgrade-type">(${mod.nome})</span>`;
        mod.texto.forEach(function(prop){
            card += `<p class="upgrade-desc"><strong>${prop.campo}:</strong> ${prop.desc}</p>`;
        });
        card += '</div>';
    });

    card += '</div>';
    onde.before(card);
    if(elimina){
        onde.remove();
    }
}

$('.abilities').on('click', '.edit-habilidade', function(){
    edit_habilidade($(this).closest('.ability-card'), $(this).parent().find('.saved-ability').val().replaceAll("||", "\""));
})

function mod_mais(){
    return `<div class="ability-upgrade">
                    <h3>Modificação: </h3> <button type="button" class="mod-menos">-</button>
                    <span style="display: flex; gap: 5px;"><label>nome: </label> <input type="text" name="nome-mod[]" style="width: 90%"> </span>
                    <span style="display: flex; gap: 100px;"> <label for="mod-custo[]">Custo</label> <label for="modifica[]">Modificação</label> </span>
                    <span><input type="number" name="mod-custo[]"></span>
                    <span><select name="mod-p[]"> <option value="PE">PE</option> <option value="PC">PC</option> </select></span>
                    <span><input type="text" name="modifica[]" size=30></span>
                    <div><select name="mod-prop[]">
                            <option value="Alcance">Alcance</option>
                            <option value="Alvo">Alvo</option>
                            <option value="Duração">Duração</option>
                            <option value="Ataque">Ataque</option>
                            <option value="Gatilho">Gatilho</option>
                            <option value="Acerto">Acerto</option>
                            <option value="Erro">Erro</option>
                            <option value="Efeito">Efeito</option>
                            <option value="Especial">Especial</option>
                        </select>:<textarea name="mod-desc[]"></textarea></div>
                    <button type="button" class="mais-mod">+</button>
                </div>`;
}

function prop_mod_mais(){
    return `
        <div><select name="mod-prop[]"">
            <option value="Alcance">Alcance</option>
            <option value="Alvo">Alvo</option>
            <option value="Duração">Duração</option>
            <option value="Ataque">Ataque</option>
            <option value="Gatilho">Gatilho</option>
            <option value="Acerto">Acerto</option>
            <option value="Erro">Erro</option>
            <option value="Efeito">Efeito</option>
            <option value="Especial">Especial</option>
        </select>:<textarea name="mod-desc[]"></textarea>
        <button class="mod-menos">-</button></div>
    `;
}

function new_prop($mod, value){
    if($mod.find('[name="mod-desc[]"]').first().val() == ""){
        $mod.find('[name="mod-prop[]"]').val(value['campo']);
        $mod.find('[name="mod-desc[]"]').val(value['desc']);
    } else {
        const $new = $(prop_mod_mais());
        $new.find('[name="mod-prop[]"]').val(value['campo']);
        $new.find('[name="mod-desc[]"]').val(value['desc']);
        $mod.find('.mais-mod').before($new);
    }
}

function new_modificacao(value){
    const $new = $(mod_mais());

    $new.find('[name="nome-mod[]"]').val(value['nome']);
    $new.find('[name="mod-custo[]"]').val(value['custo']);
    $new.find('[name="mod-p[]"]').val(value['p']);
    $new.find('[name="modifica[]"]').val(value['modifica']);
    value.texto.forEach(function(prop){
        new_prop($new, prop);
    });

    return $new;
}

function edit_habilidade(onde, save=null){
    $.confirm({
        title: "Nova Habilidade!",
        content: ''+
        '<form action="">'+
            '<div class="ability-header">'+
                `<select name="action" id="action">
                    <option value="ação">Ação</option>
                    <option value="bônus">Ação bônus</option>
                    <option value="livre">Ação livre</option>
                    <option value="reação">Reação</option>
                    <option value="mais">Complexo</option>
                </select>`+
                '<label for="nome">Nome:</label>'+
                '<input type="text" placeholder="Raio de Fogo" name="nome" id="nome">'+
                '<input type="number" value=0 name="pe" id="pe"><label for="pe">PE</label>'+
            '</div>'+
            '<label for="tags">Descritores:</label><input type="text" name="tags" id="tags" placeholder="Separe por vírgula (ex: ELFE,INVERNO,ATAQUE)">'+
            '<div class="ability-body">'+
                '<h2>texto</h2>'+
                '<label for="alcance">Alcance:</label> <input type="text" name="alcance" id="alcance" placeholder="9m (6q)">'+
                '<label for="alvo">Alvo:</label> <input type="text" name="alvo" id="alvo" placeholder="1 criatura">'+
                '<label for="duracao">Duração:</label> <input type="text" name="duracao" id="duracao" placeholder="instantânea">'+
                '<label for="ataque">Ataque:</label> <input type="text" name="ataque" id="ataque" placeholder="mágico vs DES">'+
                '<label for="gatilho">Gatilho:</label> <input type="text" name="gatilho" id="gatilho" placeholder="1 criatura no alcance dança a grega">'+
            '</div>'+
            '<div class="ability-body">'+
                '<h2>Efeitos</h2>'+
                '<label for="acerto">Acerto:</label> <textarea name="acerto" id="acerto" placeholder="causa 2d6 de dano ÍGNEO"></textarea>'+
                '<label for="erro">Erro:</label> <textarea name="erro" id="erro" placeholder="você dança a egípcia"></textarea>'+
                '<label for="efeito">Efeito:</label> <textarea name="efeito" id="efeito" placeholder="chamas"></textarea>'+
                '<label for="especial">Especial:</label> <textarea name="especial" id="especial" placeholder="essa habilidade sofre os efeitos de dançar o nordíco"></textarea>'+
            '</div>'+
            '<div>'+
                '<h2>Modificações</h2>'+
                '<button type="button" id="mais-modificacao">+</button>'+
            '</div>'+
        '</form>',
        buttons: {
            formSubmit: {
                text: "Salvar",
                btnClass: "btn-green",
                action: function(){
                    let arr = this.$content.find('form').serializeArray();
                    let obje = {};
                    $.each(arr, function(index, field) {
                        if(field.name[field.name.length-1]==']'){
                            return;
                        }
                        if(field.name=="tags"){
                            obje[field.name] = field.value.toUpperCase();
                        }
                        obje[field.name] = field.value;
                    });
                    obje.modificacoes = [];
                    this.$content.find(".ability-upgrade").each(function(){
                        const $mod = $(this);

                        let entry = {
                            'nome': $mod.find('[name="nome-mod[]"]').val(),
                            'custo': $mod.find('[name="mod-custo[]"]').val(),
                            'p': $mod.find('[name="mod-p[]"]').val(),
                            'modifica': $mod.find('[name="modifica[]"]').val(),
                            'texto': []
                        }
                        $mod.find("div").each(function(){
                            const $prop = $(this);
                            const prop = {
                                'campo': $prop.find('[name="mod-prop[]"]').val(),
                                'desc': $prop.find('[name="mod-desc[]"]').val()
                            }
                            entry.texto.push(prop);
                        });
                        obje.modificacoes.push(entry);
                    });
                    console.log(obje);
                    nova_habilidade(onde, obje, save!=null);
                }
            },
            cancel: function(){

            }
        },
        onContentReady: function () {
            let cont = this.$content;
            cont.find('#mais-modificacao').on("click", function(){
                const $aux = $(this).before(mod_mais());
                autosize($aux.find('textarea'));
            });
            cont.on('click', '.mod-menos', function(){
                $(this).parent().remove();
            })
            cont.on('click', '.mais-mod', function(){
                const $aux = $(this).before(prop_mod_mais());
                autosize($aux.find('textarea'));
            })

            if(save){
                let obje = JSON.parse(save);
                cont.find('#action').val(obje['action']);
                cont.find('#nome').val(obje['nome']);
                cont.find('#pe').val(obje['pe']);
                cont.find('#tags').val(obje['tags']);
                cont.find('#alcance').val(obje['alcance']);
                cont.find('#alvo').val(obje['alvo']);
                cont.find('#duracao').val(obje['duracao']);
                cont.find('#ataque').val(obje['ataque']);
                cont.find('#gatilho').val(obje['gatilho'])
                cont.find('#acerto').val(obje['acerto']);
                cont.find('#erro').val(obje['erro']);
                cont.find('#efeito').val(obje['efeito']);
                cont.find('#especial').val(obje['especial']);
                obje['modificacoes'].forEach(function(aux){
                    cont.find('#mais-modificacao').before(new_modificacao(aux));
                });
            }

            autosize(cont.find('textarea'));
        }
    });


}

$('.mais-habilidade').on("click", function(){
    edit_habilidade($(this).parent(), null);
});

$('.page-nav').on('click', '.nav-button', function(){
    const $this = $(this);
    const targetPanelId = $this.data('target');

    $('.nav-button').removeClass('active');
    $('.content-panel').removeClass('active');

    $this.addClass('active');
    $(targetPanelId).addClass('active');
    autosize($(targetPanelId).find('textarea'));
});

$('.hide-button').on('click', function(){
    const $button = $(this);
    const $parent = $button.parent();
    const new_state = $button.data('shown');

    if(new_state){
        $parent.addClass('hidden');
        $button.html('<');
        $button.data('shown', false);
    } else {
        $parent.removeClass('hidden');
        $button.html('v');
        $button.data('shown', true);
    }
});