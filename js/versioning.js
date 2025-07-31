const VERSION = "1.0.0";

function applyVersion(dataObject){
    dataObject['version'] = VERSION;
}

function verifyVersion(dataObject){
    switch(dataObject['version']){
        default:
        case "1.0.0":
            break;
    }
}