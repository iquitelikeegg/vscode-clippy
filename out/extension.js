"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const bingSearch = require("./bing-search");
const bing_search = bingSearch.bing_search;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('clippy.helloWorld', () => {
        // Create and show a new webview
        const panel = vscode.window.createWebviewPanel('clippy', // Identifies the type of the webview. Used internally
        'Clippy', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in.
        {} // Webview options. More on these later.
        );
        // And set its HTML content
        panel.webview.html = getWebviewContent();
    }));
}
exports.activate = activate;
function getWebviewContent() {
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Cat Coding</title>
			</head>
			<body>
				<img src="https://media.giphy.com/media/S6O0rSYnsT7TMo32JC/giphy.gif" width="200" />
			</body>
			</html>`;
}
//   <div class="tenor-gif-embed" data-postid="14148665" data-share-method="host" data-width="100%" data-aspect-ratio="1.0204918032786885"><a href="https://tenor.com/view/bloodbros-microsoft-office-ms-office-clippy-paperclip-gif-14148665">Bloodbros Microsoft Office GIF</a> from <a href="https://tenor.com/search/bloodbros-gifs">Bloodbros GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>
// <img src="https://tenor.com/view/bloodbros-microsoft-office-ms-office-clippy-paperclip-gif-14148665" width="300" />
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map