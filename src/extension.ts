/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from 'path';

import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

// import traverse from '@babel/traverse';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vscode-antv.start', (fileUri: vscode.Uri) => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const uriFsPath = fileUri.fsPath;

    vscode.window.showInformationMessage('AntV for VSCode started!');

    vscode.window.createWebviewPanel('antv', `AntV: ${path.basename(uriFsPath)}`, vscode.ViewColumn.Beside);

    vscode.workspace.fs.readFile(fileUri).then((uint8array) => {
      // 获取当前文件的纯文本
      const rawText = new TextDecoder().decode(uint8array);
      // 将纯文本转换为AST
      const ast = parser.parse(rawText);
      let dataBinding;
      traverse(ast, {
        enter(path) {
          if (t.isIdentifier(path.node) && path.scope.hasBinding('data')) {
            // 获得图表数据的binding对象，其中包含数据的声明和引用等信息
            dataBinding = path.scope.getBinding('data');
          }
        },
      });
      console.log(ast);
    });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
