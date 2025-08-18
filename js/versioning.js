const VERSION = "1.2.0";

function applyVersion(dataObject){
    dataObject['version'] = VERSION;
}

function verifyVersion(dataObject){
    switch(dataObject['version']){
        default:
        case "1.0.0":
            for(let aux = 0; aux < dataObject.habilidades.length; aux++){
                dataObject.habilidades[aux].modificacoes = [];
                const hab = dataObject.habilidades[aux];
                for(let i = 1; i <= hab['quant-modificacao']; i++){
                    let entry = {
                        'nome': '', 
                        'custo': hab['mod'+i+'-custo'],
                        'p' : hab['mod'+i+'-p'].toUpperCase(),
                        'modifica': hab['mod'+i+'ifica'],
                        'texto': []
                    }
                    for(let j = 1; j <= hab['quant-mod'+i]; j++){
                        const prop = {
                            'campo': hab['mod'+i+'-prop'+j],
                            'desc': hab['mod'+i+'-desc'+j]
                        }
                        entry.texto.push(prop);
                    }
                    dataObject.habilidades[aux].modificacoes.push(entry);
                }
            }
        case "1.2.0":
            console.log(dataObject);
            break;
    }
}