// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as bingSearch from './bing-search';

const bing_search = bingSearch.bing_search

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
	  vscode.commands.registerCommand('clippy.helloWorld', () => {
		const clippy_js_on_disk = vscode.Uri.file(
			path.join(context.extensionPath, "src/clippy/build/clippy.min.js")
		);
		const clippy_css_on_disk = vscode.Uri.file(
			path.join(context.extensionPath, "src/clippy/build/clippy.css")
		)
		

		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
		  'clippy', // Identifies the type of the webview. Used internally
		  'Clippy', // Title of the panel displayed to the user
		  vscode.ViewColumn.One, // Editor column to show the new webview panel in.
		  {
			enableScripts: true,

			localResourceRoots: [
				context.extensionUri
			]
		  } // Webview options. More on these later.
		);


		//@ts-ignore
		const clippy_js = panel.webview.asWebviewUri(clippy_js_on_disk)
		//@ts-ignore
		const clippy_css = panel.webview.asWebviewUri(clippy_css_on_disk)

		// And set its HTML content
		panel.webview.html = getWebviewContent(clippy_js, clippy_css);

		
	  })
	);
  }

  function getWebviewContent(clippy_js:any, clippy_css:any) {
  return   `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clippy</title>
      <link rel="stylesheet" type="text/css" href="${clippy_css}" media="all">
  </head>
  <body>
    <label for="name">Imagine this is the editor</label>
	<input type="text" id="name" />
	<button id="test">click me</button>

    <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
    <script src="${clippy_js}"></script>
    <!-- Init script -->
	<script type="text/javascript">
		let input = document.querySelector('#name');
		input.value = 'helo'

		let test = document.querySelector('#test');
		
		document.querySelector('#test').addEventListener('click', function(event) {
			document.querySelector('#name').value = 'yep'
			// document.getElementsByTagName('body')[0].innerHTML = 'Yes this has changed'
		});

		// input.addEventListener('hover', function(event) {
		// 	document.getElementById('test').innerHTML = ''
		// 	document.getElementsByTagName('body')[0].innerHTML = 'Yes this has changed'
		// });

		help_options = {
			"use": "Looks like you're trying to use hooks!",
			"for": "Looks like you're trying to write a for loop!",
			"switch": "Looks like you're trying to write a switch statement!",
		}

		clippy.load('Clippy', function(agent) {
			agent.animate();
			input.addEventListener('keypress', (e) => {
			if (e.code === "Space") {
				speak(agent, e.target.value);
			}
			});
		});

      const speak = (agent, query) => {
        words = query.split(" ")
        // Always get the last typed word
        query_output = help_options[words[words.length - 1]]
        if (query_output) {
          agent.play('Searching');
          agent.speak(query_output);
        }
      }
    </script>
  </body>
</html>`
}

// this method is called when your extension is deactivated
export function deactivate() {}
