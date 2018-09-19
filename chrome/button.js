document.getElementById('group-tabs').addEventListener('click', () => {
    chrome.runtime.sendMessage({command: 'group-tabs'});
});

document.getElementById('split-tabs').addEventListener('click', () => {
    chrome.runtime.sendMessage({command: 'split-tabs'});
});