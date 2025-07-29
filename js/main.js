$('#mais-aptidao').on("click", function(e){
    let quant_aptidao = Math.round($('#quant-aptidao').val());
    $(this).before('<div class="skill-entry">'+
        '<input type="checkbox" name="prof-aptidao'+quant_aptidao+'" id="prof-aptidao'+quant_aptidao+'">'+
        '<label for="val-aptidao'+quant_aptidao+'">Aptidão (<input type="text" size=10 name="nome-aptidao'+quant_aptidao+'">):</label>'+
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
                '<input type="number" name="item'+quant_itens+'-vol" class="vol-entries">'+
                '<input type="number" name="item'+quant_itens+'-frag" class="frag-entries">'+
                '<input type="text" name="item'+quant_itens+'-desc" placeholder="Descrição...">'+
                '<button class="edit" type="button" name="menos-item'+quant_itens+'" id="menos-item'+quant_itens+'">-</button>'+
            '</div>');
    $('#menos-item'+quant_itens).on('click', function(e){
        $(this).parent().remove();
        $('#quant-item').val(Math.round($('#quant-item').val())-1);
    });
    $('[name="item'+quant_itens+'-vol"]').on("change", on_change_vol);
    $('[name="item'+quant_itens+'-frag"]').on("change", on_change_frag);
    $('#quant-item').val(quant_itens);
});
function ação_img(nome) {
    switch (nome) {
        case "ação":
            return '<img src="Simbolo Habilidades/Ação.png" class="icon">';
        case "bônus":
            return '<img src="Simbolo Habilidades/Ação bônus.png" class="icon">';
        case "livre":
            return '<img src="Simbolo Habilidades/Ação livre.png" class="icon">';
        case "reação":
            return '<img src="Simbolo Habilidades/Reação.png" class="icon">';
        case "mais":
            return '<img src="Simbolo Habilidades/+Ações.png" class="icon">';
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

    let quant_habilidade = Math.round($('#quant-habilidade').val());
    if(!elimina) quant_habilidade++;
    else {
         let a = onde.find(".edit button").attr("id");
         quant_habilidade = Math.round(a[a.length-1]);
    }
    let card = '<div class="ability-card"> <div class="ability-header">'+
                    '<span class="icon">'+ação_img(content['action'])+'</span>'+
                    '<span class="ability-name">'+content['nome']+'</span>'+
                    ((content['pe']>0) ? ('<span class="ability-cost">'+content['pe']+' PE</span>') : '')+
                    '<span class="edit"><button type="button" id="edit-ability'+quant_habilidade+'">edit</button></span>'+
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
    for(i = 1; i<=Math.round(content['quant-modificacao']); i++){
        card += '<div class="ability-upgrade">'+
            '<span class="icon">▷</span>'+
            '<span class="upgrade-cost">+'+content['mod'+i+'-custo']+' '+content['mod'+i+'-p'].toUpperCase()+'</span>'+
            '<span class="upgrade-type">['+content['mod'+i+'ifica'].toUpperCase()+']</span>';
        for(j = 1; j<=Math.round(content['quant-mod'+i]); j++){
            card += '<p class="upgrade-desc"><strong>'+content['mod'+i+'-prop'+j]+'</strong> '+content['mod'+i+'-desc'+j]+'</p>';
        }
        card+='</div>';
    }
    save = JSON.stringify(content);

    card += '<input type="hidden" value="'+save.replaceAll("\"", "||")+'" name="saved-ability'+quant_habilidade+'" id="saved-ability'+quant_habilidade+'"> </div>';
    onde.before(card);
    if(elimina){
        onde.remove();
    } else {
        $('#quant-habilidade').val(quant_habilidade);
    }
    $('#edit-ability'+quant_habilidade).on("click", function () {
        edit_habilidade($(this).parent().parent().parent(), save);
    });
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
                '<h2>Propriedades</h2>'+
                '<label for="alcance">Alcance:</label> <input type="text" name="alcance" id="alcance" placeholder="9m (6q)">'+
                '<label for="alvo">Alvo:</label> <input type="text" name="alvo" id="alvo" placeholder="1 criatura">'+
                '<label for="duracao">Duração:</label> <input type="text" name="duracao" id="duracao" placeholder="instantânea">'+
                '<label for="ataque">Ataque:</label> <input type="text" name="ataque" id="ataque" placeholder="mágico vs DES">'+
                '<label for="gatilho">Gatilho:</label> <input type="text" name="gatilho" id="gatilho" placeholder="1 criatura no alcance dança a grega">'+
            '</div>'+
            '<div class="ability-body">'+
                '<h2>Efeitos</h2>'+
                '<label for="acerto">Acerto:</label> <input type="text" name="acerto" id="acerto" placeholder="causa 2d6 de dano ÍGNEO">'+
                '<label for="erro">Erro:</label> <input type="text" name="erro" id="erro" placeholder="você dança a egípcia">'+
                '<label for="efeito">Efeito:</label> <input type="text" name="efeito" id="efeito" placeholder="chamas">'+
                '<label for="especial">Especial:</label> <input type="text" name="especial" id="especial" placeholder="essa habilidade sofre os efeitos de dançar o nordíco">'+
            '</div>'+
            '<div>'+
                '<h2>Modificações</h2>'+
                '<button type="button" id="mais-modificacao">+</button>'+
                '<input type="hidden" id="quant-modificacao" value=0>'+
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
                        if(field.name=="tags"){
                            obje[field.name] = field.value.toUpperCase();
                        }
                        obje[field.name] = field.value;
                    });
                    nova_habilidade(onde, obje, save!=null);
                }
            },
            cancel: function(){

            }
        },
        onContentReady: function () {
            let cont = this.$content;
            cont.find('#mais-modificacao').on("click", function(e){
                let quant_mod = Math.round(cont.find('#quant-modificacao').val()) + 1;
                $(this).before('<div class="ability-upgrade">'+
                    '<h3>Mod'+quant_mod+'</h3> <button class="edit" type="button" id="mod'+quant_mod+'-menos">-</button>'+
                    '<span><label for="mod'+quant_mod+'-custo">-M +</label><\span>'+
                    '<span><input type="number" name="mod'+quant_mod+'-custo" id="mod'+quant_mod+'-custo"></span>'+
                    '<span><select name="mod'+quant_mod+'-p" id="mod'+quant_mod+'-p"> <option value="pe">pe</option> <option value="pc">pc</option> </select></span>'+
                    '<span><input type="text" name="mod'+quant_mod+'ifica" id="mod'+quant_mod+'ifica" size=30></span>'+
                    '<div><input type="text" name="mod'+quant_mod+'-prop1" id="mod'+quant_mod+'-prop1" size=20>:<input type="text" name="mod'+quant_mod+'-desc1" id="mod'+quant_mod+'-desc1" size=75></div>'+
                    '<button type="button" id="mais-mod'+quant_mod+'">+</button>'+
                    '<input type="hidden" id="quant-mod'+quant_mod+'" value=1>'+
                '</div>');
                cont.find('#mod'+quant_mod+'-menos').on("click", function(){
                    $(this).parent().remove();
                    cont.find('#quant-modificacao').val(Math.round(cont.find('#quant-modificacao').val())-1);
                });
                cont.find('#mais-mod'+quant_mod).on("click", function(){
                    let quant_mods = Math.round(cont.find('#quant-mod'+quant_mod).val()) + 1;
                    $(this).before('<div><input type="text" name="mod'+quant_mod+'-prop'+quant_mods+'" id="mod'+quant_mod+'-prop'+quant_mods+'" size=20>:<input type="text" name="mod'+quant_mod+'-desc'+quant_mods+'" id="mod'+quant_mod+'-desc'+quant_mods+'" size=75> <button id="mod'+quant_mod+'-menos'+quant_mods+'">-</button></div>');
                    cont.find('#mod'+quant_mod+'-menos'+quant_mods).on("click", function(){
                        $(this).parent().remove();
                        cont.find('#quant-mod'+quant_mod).val(Math.round(cont.find('#quant-mod'+quant_mod).val())-1);
                    });
                    cont.find('#quant-mod'+quant_mod).val(quant_mods);
                });
                cont.find('#quant-modificacao').val(quant_mod);
            });

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
                modi = 0;
                while(modi<obje['quant-modificacao']){
                    cont.find('#mais-modificacao').trigger("click");
                    modi++;
                    cont.find('#mod'+modi+'-custo').val(obje['mod'+modi+'-custo']);
                    cont.find('#mod'+modi+'-p').val(obje['mod'+modi+'-p']);
                    cont.find('#mod'+modi+'ifica').val(obje['mod'+modi+'ifica']);
                    modj = 0
                    while(modj<obje['quant-mod'+modi]){
                        if(modj > 0) cont.find('#mais-mod'+modi).trigger("click");
                        modj++;
                        cont.find('#mod'+modi+'-prop'+modj).val(obje['mod'+modi+'-prop'+modj]);
                        cont.find('#mod'+modi+'-desc'+modj).val(obje['mod'+modi+'-desc'+modj]);
                    }
                }
            }
        }
    });


}

$('.mais-habilidade').on("click", function(){
    edit_habilidade($(this).parent(), null);
});