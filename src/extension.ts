// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as bingSearch from './bing-search';

const bing_search = bingSearch.bing_search


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let clippyPanel:any = null

	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection((event) => {
			let text = event.textEditor.document.getText(event.selections[0])
			
			console.log(text)

			if (text) {
				if (clippyPanel)
					clippyPanel.dispose()

				clippyPanel = clippy(context, text)
			}
		})
	)
}

function clippy(context: any, text: string) {
	// Create and show a new webview
	const panel = vscode.window.createWebviewPanel(
	  'clippy', // Identifies the type of the webview. Used internally
	  'Clippy', // Title of the panel displayed to the user
	  {
		  viewColumn: vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
		  preserveFocus: true
	  },
	  {
		enableScripts: true,

		localResourceRoots: [
			context.extensionUri
		],
		
	  }
	);

	const clippy_js_on_disk = vscode.Uri.file(
		path.join(context.extensionPath, "src/clippy/build/clippy.min.js")
	);
	const clippy_css_on_disk = vscode.Uri.file(
		path.join(context.extensionPath, "src/clippy/build/clippy.css")
	)

	//@ts-ignore
	const clippy_js = panel.webview.asWebviewUri(clippy_js_on_disk)
	//@ts-ignore
	const clippy_css = panel.webview.asWebviewUri(clippy_css_on_disk)

	// And set its HTML content
	panel.webview.html = getWebviewContent(clippy_js, clippy_css, text);

	return panel
}

function getWebviewContent(
	clippy_js:any, 
	clippy_css:any, 
	text:string
) {
	return   `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Clippy</title>
			<link rel="stylesheet" type="text/css" href="${clippy_css}" media="all">
		</head>
		<body>
			<input type="hidden" id="name" value="${text}"/>

			<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
			<script src="${clippy_js}"></script>
			<!-- Init script -->
			<script type="text/javascript">
				help_options = {
					"use": "Looks like you're trying to use hooks!",
					"for": "Looks like you're trying to write a for loop!",
					"switch": "Looks like you're trying to write a switch statement!",
				}

				let input = document.querySelector('#name');

				clippy.load('Clippy', function(agent) {
					agent.animate();
					speak(agent, input.value);
				});

			const speak = (agent, query) => {
				words = query.split(" ")
				
				// Loop over the selection in reverse and find the first match
				query_output = ''
				for (let i = words.length - 1; i >= 0; i--) {
					console.log(i)
					if (Object.keys(help_options).indexOf(words[i].toLowerCase()) !== -1) {
						query_output = help_options[words[i].toLowerCase()]
						break;
					}
				}

				if (query_output) {
					agent.play('Searching');

					// Bing search

					agent.speak(query_output);
				}
			}
			</script>
		</body>
		</html>`
}

// this method is called when your extension is deactivated
export function deactivate() {}
