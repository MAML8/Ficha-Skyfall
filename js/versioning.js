const VERSION = "1.2.0";

function applyVersion(dataObject){
    dataObject['version'] = VERSION;
    return dataObject;
}

function verifyVersion(dataObject){
    switch(dataObject['version']){
        default:
        case "1.0.0":
        case "1.2.0":
            console.log(dataObject);
            break;
    }
}