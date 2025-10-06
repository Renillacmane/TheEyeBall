module.exports = {
    // Print message if mode is true
    printConsole(mode, message){
        // Convert string 'true'/'false' to boolean if needed
        const shouldPrint = typeof mode === 'string' ? mode.toLowerCase() === 'true' : Boolean(mode);
        if (shouldPrint) console.log(message);
    },


    // setting a timeout
    async wait(miliseconds){
        await new Promise(resolve => setTimeout(resolve, miliseconds));
    }
}
