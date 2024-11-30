(function () {
    const vscode = acquireVsCodeApi();

    document.getElementById('vscs_play_button').addEventListener('click', () => {
        //const commandInput = document.querySelector('#command-input').value;
        console.log("play_pause");
        vscode.postMessage({ type: 'play_pause'});
    });

    document.getElementById('vscs_prev_button').addEventListener('click', () => {
        //const commandInput = document.querySelector('#command-input').value;
        vscode.postMessage({ type: 'prev'});

    });

    document.getElementById('vscs_next_button').addEventListener('click', () => {
        //const commandInput = document.querySelector('#command-input').value;
        vscode.postMessage({ type: 'next'});

    });
}());
