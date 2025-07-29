$(function(){

    const localStorageKeyPrefix = "skyfallCharacterSheetData-";
    const $form = $("#character-sheet");
    const exclusions = ["quant-habilidade", "bonus-prof"]

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
            if(exclusions.includes(field.name)){
                return;
            }
            dataObject[field.name] = field.value;
        });

        return dataObject;
    }

    function saveData() {
        const dataObject = getFormData();

        localStorage.setItem(localStorageKeyPrefix+dataObject['char-name'], LZString.compressToUTF16(JSON.stringify(dataObject)));

        $.alert("Ficha salva com sucesso")
    }

    function exportData(){
        let dataObject = getFormData();

        const dataString = JSON.stringify(dataObject, null, 4);
            
        // Create a "Blob" which is like a file in memory.
        const blob = new Blob([dataString], { type: 'application/json' });
        
        // Create a temporary URL for the Blob.
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link element to trigger the download.
        const a = document.createElement('a');
        a.href = url;
        a.download = 'skyfall_ficha.json'; // The default filename for the download.
        
        // Programmatically click the link to start the download.
        document.body.appendChild(a);
        a.click();
        
        // Clean up by removing the temporary link and URL.
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
            $.alert("arquivo recebido mal formado");
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
                        default:
                            break;
                    }
                } else {
                    $element.val(value);
                }
            } else if(key.startsWith("saved-ability")){
                let obje = value;
                let $onde = $("#mais-habilidade").parent();
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
    $("#export-button").on("click", exportData);
    $("#load-button").on("click", function(e) {
        $.confirm({
            title: "Carregar Personagem",
            content: ''+
            '<form action="">'+
                '<input type="text" name="nomeSearch" id="nomeSearch">'+
                '<input type="file" name="jsonLoad" id="jsonLoad" accept=".json">'+
            '</form>',
            buttons:{
                formSubmit: {
                    text: "Carregar",
                    btnClass: "btn-blue",
                    action: function(){
                        let source = this.$content.find("#nomeSearch").val();
                        const file = this.$content.find("#jsonLoad")[0].files[0];
                        if (file){
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                try {
                                    const jsonString = e.target.result;
                                    const jsonObject = JSON.parse(jsonString); // Parse JSON string to object

                                    loadData(jsonObject);
                                } catch (error) {
                                    console.error("Error parsing JSON:", error);
                                    $.alert("Arquivo recebido invalido");
                                }
                            };

                            reader.onerror = function(e) {
                                console.error("Error reading file:", e.target.error);
                                $.alert("Error reading the file.");
                            };
                            reader.readAsText(file); // Read the file content as text
                            return;
                        }

                        loadData(source);
                    }
                },
                cancel: function(){

                }
            }
        })
    });
});