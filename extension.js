const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerTextEditorCommand('vueStyle.beautify', function (textEditor) {
    vscode.window.showInformationMessage('Hello World!');
    console.log(textEditor)
  });

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
