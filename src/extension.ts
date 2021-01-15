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
  return   `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Clippy</title>
      <link rel="stylesheet" type="text/css" href="src/clippy/build/clippy.css" media="all">
  </head>
  <body>
    <label for="name">Imagine this is the editor</label>
    <input type="text" id="name">
    
    
    <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
    <script src="src/clippy/build/clippy.js"></script>
    <!-- Init script -->
    <script type="text/javascript">
    const input = document.querySelector('input');

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
