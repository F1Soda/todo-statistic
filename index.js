const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');

const files = getFiles();

console.log('Please, write your command!');
const todos = getAllTodoComments();
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    if (command.startsWith('user ')) {
        const username = command.split(' ')[1];
        if (username) {
            for (const line of getTodoCommentsByUser(username)) {
                console.log(line);
            }
        } else {
            console.log('Please specify a username');
        }
    } else if (command.startsWith('sort ')) {
        const sortType = command.split(' ')[1];
        switch (sortType) {
            case 'importance':
                sortByImportance().forEach(comment => console.log(comment));
                break;
            case 'user':
                sortByUser().forEach(comment => console.log(comment));
                break;
            case 'date':
                sortByDate().forEach(comment => console.log(comment));
                break;
            default:
                console.log('Invalid sort type. Use: importance, user, or date.');
        }
    } else {
        switch (command) {
            case 'exit':
                process.exit(0);
                break;
            case 'show':
                for (const line of todos) {
                    console.log(line);
                }
                break;
            case 'important':
                for (const line of getImportantTodoComments()) {
                    console.log(line);
                }
                break;
            default:
                console.log('wrong command');
                break;
        }
    }
}

function getAllTodoComments() {
    const comments = [];
    for (const file of files) {
        const lines = file.split('\n');

        for (let line of lines) {
            line = line.trim();

            const match = line.match(/\/\/\s*TODO:?\s*(.*)/i);
            if (match) {
                comments.push(match[0]);
            }
        }
    }

    return comments;
}

function getImportantTodoComments() {
    return todos.filter(comment => comment.includes('!'));
}

function getTodoCommentsByUser(username) {
    return todos.filter(comment => {
        const match = comment.match(/\/\/\s*TODO\s*([^;]+);/);
        return match && match[1].trim().toLowerCase() === username.toLowerCase();
    });
}


function sortByImportance() {
    return [...todos].sort((a, b) => {
        const countA = (a.match(/!/g) || []).length;
        const countB = (b.match(/!/g) || []).length;
        return countB - countA;
    });
}

function sortByUser() {
    return [...todos].sort((a, b) => {
        const userA = (a.match(/\/\/\s*TODO\s*([^;]+);/) || [])[1] || 'zzzz';
        const userB = (b.match(/\/\/\s*TODO\s*([^;]+);/) || [])[1] || 'zzzz';
        return userA.localeCompare(userB);
    });
}


function sortByDate() {
    return [...todos].sort((a, b) => {
        const dateA = (a.match(/\/\/\s*TODO\s*[^;]+;\s*([^;]+);/) || [])[1];
        const dateB = (b.match(/\/\/\s*TODO\s*[^;]+;\s*([^;]+);/) || [])[1];

        if (!dateA) return 1;
        if (!dateB) return -1;

        return new Date(dateB) - new Date(dateA);
    });
}
