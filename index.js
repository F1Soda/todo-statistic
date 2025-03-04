const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function getTodoComments() {
    const comments = [];
    for (const file of files) {
        const lines = file.split('\n');

        for (const line of lines) {
            line.trim(); // Убираем лишние пробелы в начале и конце
            if (line.startsWith('// TODO ')) {
                comments.push(line.split('\r')[0]);
            }
        }
    }

    return comments;
}

console.log(getTodoComments())