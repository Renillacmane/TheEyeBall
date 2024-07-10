module.exports = {
    // Print message if mode is true
    printConsole(mode, message){
        if (mode==="true") console.log(message);
    },


    // setting a timeout
    async wait(miliseconds){
        await new Promise(resolve => setTimeout(resolve, miliseconds));
    }
}