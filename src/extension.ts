// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as bingSearch from './bing-search';

const bing_search = bingSearch.bing_search

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
	  vscode.commands.registerCommand('clippy.helloWorld', () => {
		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
		  'clippy', // Identifies the type of the webview. Used internally
		  'Clippy', // Title of the panel displayed to the user
		  vscode.ViewColumn.One, // Editor column to show the new webview panel in.
		  {} // Webview options. More on these later.
		);
		// And set its HTML content
		panel.webview.html = getWebviewContent();
	  })
	);
  }

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

// this method is called when your extension is deactivated
export function deactivate() {}
