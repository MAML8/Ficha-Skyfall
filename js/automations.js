function bonus_de_proficiência(){
    return 2 + Math.floor(($("#char-level").val()-1) / 4);
}

$("#char-level").on("change", function(){
    $("#bonus-prof").val(bonus_de_proficiência());
});

function on_change_vol(){
    let sumEntries = 0;
    let i = 1;
    let $entry;
    while(true){
        $entry = $('[name="item'+i+'-vol"]');
        if(!$entry.length) break;
        sumEntries += Math.round($entry.val());
        i++;
    }
    $("#carga-atual").val(sumEntries);

    if(sumEntries>$("#carga-limite").val()){
        $("#carga-atual").css("color", "red");
    } else {
        $("#carga-atual").css("color", "#333");
    }
}

function on_change_frag(){
    let sumEntries = 0;
    let i = 1;
    let $entry;
    while(true){
        $entry = $('[name="item'+i+'-frag"]');
        if(!$entry.length) break;
        sumEntries += Math.round($entry.val());
        i++;
    }
    $("#frag-atual").val(sumEntries);

    if(sumEntries>$("#frag-limite").val()){
        $("#frag-atual").css("color", "red");
    } else {
        $("#frag-atual").css("color", "#333");
    }
}

$(".vol-entries").on("change", on_change_vol);

$(".frag-entries").on("change", on_change_frag);