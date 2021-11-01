// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, EventEmitter, Uri, ExtensionContext, commands, window } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {

	const toDispose = context.subscriptions;

	const channel = window.createOutputChannel('foo-test');
	channel.show();

	const virtualDocURI = Uri.parse('foo://s/data');

	let version= 1;
	const changeEvent = new EventEmitter<Uri>();

	workspace.registerTextDocumentContentProvider('foo', {
		onDidChange : changeEvent.event,

		provideTextDocumentContent: (uri) => {
			return `My content for ${uri.toString()}, version ${version}`;
		}
	});

	toDispose.push(commands.registerCommand('test-135459.triggerUpdate', () => {
		version++;
		changeEvent.fire(virtualDocURI);
		channel.appendLine(`filed change for ${virtualDocURI}, new version ${version}.`);
	}));

	toDispose.push(workspace.onDidOpenTextDocument(e => {
		if (e.uri.scheme === 'foo') {
			channel.appendLine('onDidOpenTextDocument ' + e.uri.toString());
		}
	}));
	toDispose.push(workspace.onDidChangeTextDocument(e => {
		if (e.document.uri.scheme === 'foo') {
			channel.appendLine(`onDidChangeTextDocument ${e.document.uri.toString()}, content: ${e.document.getText()}`);
		}
	}));
	toDispose.push(workspace.onDidCloseTextDocument(e => {
		if (e.uri.scheme === 'foo') {
			channel.appendLine('onDidCloseTextDocument ' + e.uri.toString());
		}
	}));

	const doc = await workspace.openTextDocument(virtualDocURI);
	channel.appendLine(`Document ${virtualDocURI} opened.`);


}






// this method is called when your extension is deactivated
export function deactivate() {}



