document.getElementById('group-tabs').addEventListener('click', () => {
    browser.runtime.sendMessage({command: 'group-tabs'});
});

document.getElementById('split-tabs').addEventListener('click', () => {
    browser.runtime.sendMessage({command: 'split-tabs'});
});