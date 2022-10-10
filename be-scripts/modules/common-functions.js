export function groupItemsByEnvironments(input) {
    let output = {}
    for(let i = 0; i < input.length; i++) {
        if(!Object.keys(output).includes(input[i].environment)) {
            output[input[i].environment] = [input[i]];
        } else {
            output[input[i].environment].push(input[i])
        }
    }
    return output;
}