$(function(){

    const localStorageKeyPrefix = "skyfallCharacterSheetData-";
    const $form = $("#character-sheet");

    function clearForm(){
        let aux = Math.round($("#quant-habilidade").val());
        for(let i = aux; i>0; i--){
            nova_habilidade($("#saved-ability"+i).parent(), null, true);
        }
        $("#quant-habilidade").val(0);
        let i = 1;
        let $testesito = $("#menos-aptidao1");
        while($testesito.length){
            $testesito.trigger("click");
            i++;
            $testesito = $("#menos-aptidao"+i);
        }
        i = 3;
        $testesito = $("#atk3-menos");
        while($testesito.length){
            $testesito.trigger("click");
            i++;
            $testesito = $("#atk"+i+"-menos");
        }
        i = 3;
        $testesito = $("#menos-item3");
        while($testesito.length){
            $testesito.trigger("click");
            i++;
            $testesito = $("#menos-item"+i);
        }
        $("#character-sheet")[0].reset();
    }

    function clearData(e) {
        e.preventDefault();
        $.confirm({
            title: "Limpar ficha?",
            content: "Tem certeza que quer limpar a ficha?",
            buttons: {
                confirmar: function(e) {
                    clearForm();
                },
                cancelar: function(e){
                    
                }
            }
        })
    }

    function getFormData() {
        const formDataArray = $form.serializeArray();

        let dataObject = {};
        $.each(formDataArray, function(index, field) {
            if(field.name.startsWith("saved-ability")){
                dataObject[field.name] = JSON.parse(field.value.replaceAll("||", "\""));
                return;
            }
            dataObject[field.name] = field.value;
        });

        return dataObject;
    }

    function saveData() {
        let dataObject = getFormData();

        localStorage.setItem(localStorageKeyPrefix+dataObject['char-name'], LZString.compressToUTF16(JSON.stringify(dataObject)));
    }

    function loadData(source){
        if(source instanceof String || typeof source === 'string'){
            const savedDataString = LZString.decompressFromUTF16(localStorage.getItem(localStorageKeyPrefix+source));
            if(!savedDataString){
                $.alert("Nenhuma ficha salva com este nome encontrada.");
                return;
            }
            source = JSON.parse(savedDataString);
        } else if(!source){
            $.alert("arquivo recebido vazio.");
                return;
        }

        clearForm();
        //for(let key in source){
            //console.log(key, source[key]);
            //let value = source[key];
        $.each(source, function(key, value) {
            // Find the element within the form by its 'name' attribute.
            const $element = $form.find(`[name="${key}"]`);
            // If the element exists...
            if ($element.length) {
                // Check if it's a checkbox.
                if ($element.is(':checkbox')) {
                    // .prop() is the correct way to set properties like 'checked'.
                    // The value will be true or false from our saveData function.
                    $element.prop('checked', value === 'on' || value === true);
                } else if($element.is(':hidden')){
                    switch(key){
                        case "quant-aptidao":
                            for(let i = value; i>1; i--){
                                $("#mais-aptidao").trigger("click");
                            }
                            return;
                        case "quant-ataque":
                            for(let i = value; i>2; i--){
                                $("#mais-ataque").trigger("click");
                            }
                            return;
                        case "quant-item":
                            for(let i = value; i>2; i--){
                                $("#mais-item").trigger("click");
                            }
                            return;
                        case "quant-habilidade":
                            return;
                        default:
                            break;
                    }
                } else {
                    // .val() is jQuery's powerful method for setting the value
                    // of inputs, textareas, and selects.
                    $element.val(value);
                }
            } else if(key.startsWith("saved-ability")){
                let obje = value;
                let $onde = $("#mais-habilidade").parent();
                console.log(obje['tags']);
                if(obje['tags'].includes("truque")){
                    $onde = $("#mais-truque").parent();
                } else if(obje['tags'].includes("superficial")){
                    $onde = $("#mais-superficial").parent();
                } else if(obje['tags'].includes("rasa")){
                    $onde = $("#mais-rasa").parent();
                } else if(obje['tags'].includes("profunda")){
                    $onde = $("#mais-profunda").parent();
                }
                nova_habilidade($onde, obje);
            }
        });

        $.alert("Ficha carregada com sucesso!");
    }

    $("#clear-button").on("click", clearData);
    $("#save-button").on("click", saveData);
    $("#load-button").on("click", function(e) {
        $.confirm({
            title: "Carregar Personagem",
            content: ''+
            '<form action="">'+
                '<input type="text" name="nomeSearch" id="nomeSearch">'+
            '</form>',
            buttons:{
                formSubmit: {
                    text: "Carregar",
                    btnClass: "btn-blue",
                    action: function(){
                        let source = this.$content.find("#nomeSearch").val();
                        loadData(source);
                    }
                },
                cancel: function(){

                }
            }
        })
    });
});