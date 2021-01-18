"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const bing_search = require("./bing-search");
const bingSearch = bing_search.bingSearch;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let clippyPanel = null;
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((event) => {
        let text = event.textEditor.document.getText(event.selections[0]);
        if (text) {
            if (clippyPanel)
                clippyPanel.dispose();
            let helpText = clippySays(text);
            console.log(helpText);
            clippyPanel = clippy(context, helpText.say, helpText.linkText);
        }
    }));
}
exports.activate = activate;
function createHelpText(match) {
    // @ts-ignore
    return `It looks like you're trying to use ${match.category}!`;
}
function resolveCategory(matchTerm = "") {
    const termMap = {
        "loops": ["for", "while"],
        "statement": ["switch", "if", "else"],
        "html": ["html", "body", "div"],
        "variables": ["const", "let", "var"],
        "brackets": ["{", "}", "[", "]"],
        "functions": ["function", "(", ")"],
        "classes": ["class"],
        "styles": ["style"]
    };
    for (let category in termMap) {
        // @ts-ignore
        if (termMap[category].indexOf(matchTerm) !== -1) {
            return { matchTerm, category };
        }
    }
    return { matchTerm, category: "" };
}
function clippySays(text) {
    const words = text.split(" ");
    // Loop over the selection in reverse and find the first match
    let match = {};
    for (let i = words.length - 1; i >= 0; i--) {
        match = resolveCategory(words[i].toLowerCase());
        // @ts-ignore
        if (match.category !== "")
            break;
    }
    // @ts-ignore
    let linkText = bingSearch.generate_link(match.category);
    // @ts-ignore
    if (match.category === "")
        return { say: "Unable to find any results", linkText };
    // @ts-ignore
    let say = createHelpText(match);
    return { say, linkText };
}
function clippy(context, text, link) {
    // Create and show a new webview
    const panel = vscode.window.createWebviewPanel('clippy', // Identifies the type of the webview. Used internally
    'Clippy', // Title of the panel displayed to the user
    {
        viewColumn: vscode.ViewColumn.Beside,
        preserveFocus: true
    }, {
        enableScripts: true,
        localResourceRoots: [
            context.extensionUri
        ],
    });
    const clippy_js_on_disk = vscode.Uri.file(path.join(context.extensionPath, "src/clippy/build/clippy.min.js"));
    const clippy_css_on_disk = vscode.Uri.file(path.join(context.extensionPath, "src/clippy/build/clippy.css"));
    //@ts-ignore
    const clippy_js = panel.webview.asWebviewUri(clippy_js_on_disk);
    //@ts-ignore
    const clippy_css = panel.webview.asWebviewUri(clippy_css_on_disk);
    // And set its HTML content
    panel.webview.html = getWebviewContent(clippy_js, clippy_css, text, link);
    return panel;
}
function getWebviewContent(clippy_js, clippy_css, text, link) {
    return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Clippy</title>
			<link rel="stylesheet" type="text/css" href="${clippy_css}" media="all">
		</head>
		<body>
			<script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>
			<script src="${clippy_js}"></script>
			<!-- Init script -->
			<script type="text/javascript">
				let input = document.querySelector('#name');

				clippy.load('Clippy', function(agent) {
					agent.animate();
					speak(agent, "${text}", "${link}");
				});

				const speak = (agent, speech, link) => {
					agent.speak("Searching...");
					agent.play('Searching', 5000, () => {
						agent.speak(speech, true);

						let searchLink = document.createElement('a')
						searchLink.href = link
						searchLink.innerHTML = "get help online"
						document.getElementsByClassName('clippy-balloon')[0].appendChild(searchLink)

						// Hack it sometimes not setting the height of the text box correctly.
						setTimeout(() => {
							document.querySelector('.clippy-content').style.height = 'auto';
						}, 1000)
					});	
				}
			</script>
		</body>
		</html>`;
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map