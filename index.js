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
        case 'show':
            for (const line of getTodoComments()){
                console.log(line);
            }
            break;
        case 'important':
            for (const line of getImportantTodoComments()){
                console.log(line);
            }
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
            line.trim();
            if (line.startsWith('// TODO ')) {
                comments.push(line.split('\r')[0]);
            }
        }
    }

    return comments;
}


function getImportantTodoComments() {
    const importantComments = [];
    for (const file of files) {
        const lines = file.split('\n');

        for (const line of lines) {
            line.trim();
            if (line.startsWith('// TODO ') && line.includes('!')) {
                importantComments.push(line.split('\r')[0]);
            }
        }
    }

    return importantComments;
}
