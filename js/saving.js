$(function(){
    const localStorageKeyPrefix = "skyfallCharacterSheetData-";
    const $form = $("#character-sheet");
    const exclusions = ["bonus-prof"];

    function clearForm(){
        
        $('.ability-card').remove();
        $('button[name="menos-skill"]').closest(".skill-entry").remove();
        $('.prof-indicator').val(0);
        $('.prof-icon').attr("src", prof_img(0));
        $('button[name="atk-menos"]').closest(".attack-entry").remove();
        $('button[name="menos-item"]').closest(".inventory-item").remove();
        $("#character-sheet")[0].reset();
        
        autosize($('textarea'));
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
        let dataObject = {};
        $form.find('input, textarea, select').not($("#skill-list").find('[name="prof-aptidao[]"], [name="nome-aptidao[]"], [name="val-aptidao[]"]')).not($(".inventory-item input, .attack-entry input, .saved-ability")).each(function(){
            let $el = $(this);
            if($el.attr("name")){
                dataObject[$el.attr("name")] = (!$el.is(":checkbox") ? $el.val() : $el.prop("checked"));
            }
        });

        dataObject.aptidoes = [];
        $form.find('.skill-entry').each(function() {
            const $row = $(this);
            if(!$row.find('[name="prof-aptidao[]"]').length) return;

            const entry = {
                'prof': $row.find('[name="prof-aptidao[]"]').val(),
                'nome': $row.find('[name="nome-aptidao[]"]').val() != "" ? $row.find('[name="nome-aptidao[]"]').val() : 'a',
                'val': $row.find('[name="val-aptidao[]"]').val()
            };
            dataObject.aptidoes.push(entry);
        });

        dataObject.attacks = [];
        $form.find('.attack-entry').each(function(){
            const $row = $(this);

            const entry = {
                'nome': $row.find('[name="atk-nome[]"]').val() != "" ? $row.find('[name="atk-nome[]"]').val() : 'a',
                'bonus': $row.find('[name="atk-bonus[]"]').val(),
                'dano': $row.find('[name="atk-dano[]"]').val()
            }
            dataObject.attacks.push(entry);
        });

        dataObject.inventory = [];
        $form.find('.inventory-item').each(function(){
            const $row = $(this);

            const entry = {
                'nome': $row.find('[name="item-nome[]"]').val() != "" ? $row.find('[name="item-nome[]"]').val() : 'a',
                'vol': $row.find('[name="item-vol[]"]').val(),
                'frag': $row.find('[name="item-frag[]"]').val(),
                'desc': $row.find('[name="item-desc[]"]').val()
            }

            dataObject.inventory.push(entry);
        });

        dataObject.habilidades = [];
        $form.find('.saved-ability').each(function(){
            const $row = $(this);

            const entry = JSON.parse($row.val().replaceAll("||", "\""));

            dataObject.habilidades.push(entry);
        })

        dataObject = applyVersion(dataObject);
        return dataObject;
    }

    function saveData(alert = true) {
        const dataObject = getFormData();

        localStorage.setItem(localStorageKeyPrefix+dataObject['char-name'], LZString.compressToUTF16(JSON.stringify(dataObject)));

        markUrl(dataObject);
        if(alert) $.alert("Ficha de "+dataObject['char-name']+" salva com sucesso");
    }
    function markUrl(dataObject){
        const newUrl = '?nome=' + encodeURIComponent(dataObject['char-name']);
        const state = { nome: dataObject['char-name'] };
        const title = "Ficha Skyfall RPG"; // Title is often ignored by browsers, but good practice

        history.pushState(state, title, newUrl);
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
        a.download = 'skyfall_ficha_'+dataObject['char-name']+'.json'; // The default filename for the download.
        
        // Programmatically click the link to start the download.
        document.body.appendChild(a);
        a.click();
        
        // Clean up by removing the temporary link and URL.
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function loadData(source, alert=true){
        if(source instanceof String || typeof source === 'string'){
            const savedDataString = LZString.decompressFromUTF16(localStorage.getItem(localStorageKeyPrefix+source));
            if(!savedDataString){
                if(alert) $.alert("Nenhuma ficha salva com este nome encontrada.");
                return;
            }
            source = JSON.parse(savedDataString);
        } else if(!source){
            if(alert) $.alert("arquivo recebido mal formado");
                return;
        }
        verifyVersion(source);

        clearForm();

        $.each(source, function(key, value) {

            if(Array.isArray(value)){
                if(key === "habilidades"){
                    value.forEach(function(obje){
                        let $onde = $("#mais-habilidade").parent();
                        if(obje['tags'].toUpperCase().includes("TRUQUE")){
                            $onde = $("#mais-truque").parent();
                        } else if(obje['tags'].toUpperCase().includes("SUPERFICIAL")){
                            $onde = $("#mais-superficial").parent();
                        } else if(obje['tags'].toUpperCase().includes("RASA")){
                            $onde = $("#mais-rasa").parent();
                        } else if(obje['tags'].toUpperCase().includes("PROFUNDA")){
                            $onde = $("#mais-profunda").parent();
                        }
                        nova_habilidade($onde, obje);
                    });
                } else if (key === "aptidoes"){
                    value.forEach(function(aux){
                        new_aptidao(aux);
                    });
                } else if (key === "attacks"){
                    value.forEach(function(aux){
                        new_attack(aux);
                    });
                } else if (key === "inventory"){
                    value.forEach(function(aux){
                        new_item(aux);
                    });
                }
            }
            for(let i = 0; i<exclusions.length; i++){
                if(key===exclusions[i]) return;
            }
            // Find the element within the form by its 'name' attribute.
            const $element = $form.find(`[name="${key}"]`);
            // If the element exists...
            if ($element.length) {
                // Check if it's a checkbox.
                if ($element.is(':checkbox')) {
                    // .prop() is the correct way to set properties like 'checked'.
                    // The value will be true or false from our saveData function.
                    $element.prop('checked', value === 'on' || value === true);
                } else {
                    $element.val(value);
                    if($element.is(".prof-indicator")){
                        $element.parent().find(".prof-icon").attr("src", prof_img(Number(value)));
                    }
                }
            }
        });
        $("#bonus-prof").val(bonus_de_proficiência());

        autosize($('textarea'));
        if(alert) $.alert("Ficha carregada com sucesso!");
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

    function auto_load_from_url(){
        const url_param = new URLSearchParams(window.location.search);
        const char_name = url_param.get('nome');
        if(char_name){
            loadData(char_name, false);
        }
    }

    $(window).on('popstate', function(event) {
        // When the history changes, re-run the auto-load logic.
        // This keeps the page content in sync with the URL.
        auto_load_from_url();
    });

    auto_load_from_url();
});