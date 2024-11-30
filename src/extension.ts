import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const provider = new ImageProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ImageProvider.viewType, provider));
}

class ImageProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'test.sideview';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		panel: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = panel;

		panel.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		panel.webview.html = this.getViewContent(panel.webview);

		panel.webview.onDidReceiveMessage(async data => {
			switch(data.type){
				case 'play_pause':
					vscode.window.showInformationMessage("Play/Pause Button");
					break;
				case 'prev':
					vscode.window.showInformationMessage("Previous Button");
					break;
				case 'next':
					vscode.window.showInformationMessage("Next Button");
					break;
			}
		})
	}

	private getViewContent(webview: vscode.Webview) {
		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		const coverImageUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'test.png'));
		const imagePrevUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'prev.png'));
		const imagePlayUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'play.png'));
		const imageNextUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'next.png'));

		// Use a nonce to only allow a specific script to be run.
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${webview.cspSource}">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
				<link href="${styleMainUri}" rel="stylesheet">
			</head>
			<body>
				<div class="image_container">
					<div class="image_area">
						<img src="${coverImageUri}" />
					</div>
					<div class="button_group">
						<button class="overlay_button" id="vscs_prev_button">
							<img src="${imagePrevUri}" class="button_icon"/>
						</button>
						<button class="overlay_button" id="vscs_play_button">
							<img src="${imagePlayUri}" class="button_icon"/>
						</button>
						<button class="overlay_button" id="vscs_next_button">
							<img src="${imageNextUri}" class="button_icon"/>
						</button>
					</div>
				</div>
			</body>
			<script nonce="${nonce}" src="${scriptUri}"></script>
			</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
