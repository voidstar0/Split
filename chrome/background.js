class WindowTabInfo {
    
    constructor() {
        this.tabs = [];
    }

    addTab(tab) {
        if(!this.tabs.includes(tab))
            this.tabs.push(tab);
    }
    
    /**
     * Returns an array of tab ids given a hostname.
     * @param {*} hostname 
     */
    tabIdsWithHostname(hostname) {
        return this.tabs.filter(tab => {
            return tab.hostname == hostname;
        }).map(x => x.id);
    }

    hostnames() {
        //Hackery to remove duplicates but still return an array. Clean this up!
        return Array.from(new Set(this.tabs.map(t => t.hostname)));
    }

    clearTabInfo() {
        this.tabs = [];
    }
}

let windowInfo = new WindowTabInfo();

function updateWindowInfo() {
    windowInfo.clearTabInfo();
    chrome.tabs.query({currentWindow: true}, tabs => {
        tabs.forEach(tab => {
            let url = new URL(tab.url);
            windowInfo.addTab({hostname: url.hostname, id: tab.id});
        });
    });
}

function groupTabs() {
    windowInfo.hostnames().forEach(hostname => {
        chrome.tabs.move(windowInfo.tabIdsWithHostname(hostname), {index: -1});
    });
}

function removeNewTabs(tabWindow) {
    chrome.tabs.query({windowId: tabWindow}, tabs => {

        tabs.forEach(tab => {
            let url = new URL(tab.url);

            if(url.hostname.includes("newtab")) 
                chrome.tabs.remove(tab.id)
        });

    });
}

function splitTabs() {
    windowInfo.hostnames().forEach(hostname => {
        chrome.windows.create({}, createdWindow => {
            chrome.tabs.move(windowInfo.tabIdsWithHostname(hostname), {index: -1, windowId: createdWindow.id});
            removeNewTabs(createdWindow.id);
        });
    });
}

/*
* Browser Listeners
*/

chrome.tabs.onUpdated.addListener(function(wt) {
    updateWindowInfo(); 
});

chrome.commands.onCommand.addListener(function(command) {
    if(command == "organize-tabs") {
        groupTabs();
    }
    if(command == "split-tabs") {
        splitTabs();
    }
});
