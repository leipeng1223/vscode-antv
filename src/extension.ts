/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'path';

import * as vscode from 'vscode';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

function getWebviewContent() {
  // 返回webview的html内容
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
      HTML contexts
  </body>
  </html>`;
}

// 插件激活时调用
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vscode-antv.start', (fileUri: vscode.Uri) => {
    // 获取激活插件的文档的Uri
    const uriFsPath = fileUri.fsPath;

    vscode.window.showInformationMessage('AntV for VSCode started!');

    // 创建webview
    const panel = vscode.window.createWebviewPanel(
      'antv',
      `AntV: ${path.basename(uriFsPath)}`,
      vscode.ViewColumn.Beside
    );

    // 设置webview的tab icon
    panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'icons', 'icon-small.png'));

    vscode.workspace.fs.readFile(fileUri).then((uint8array) => {
      // 获取当前文件的纯文本
      const rawText = new TextDecoder().decode(uint8array);
      // 将纯文本转换为AST
      const ast = parser.parse(rawText);
      let dataBinding;
      // 遍历AST并操作节点（TODO）
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

    // webview获取html
    panel.webview.html = getWebviewContent();
  });
  context.subscriptions.push(disposable);
}

// 插件关闭时调用
export function deactivate() {}
