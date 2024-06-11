let activeTabs = {};

const api = (typeof browser !== 'undefined') ? browser : chrome;

api.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setReload') {
    api.alarms.create(`reload-${request.tabId}`, { periodInMinutes: request.interval / 60 });
    if (!activeTabs[request.tabId]) {
      activeTabs[request.tabId] = { interval: request.interval, count: 0 };
    } else {
      activeTabs[request.tabId].interval = request.interval;
    }
    sendResponse({status: "Reload set for tab: " + request.tabId});
  } else if (request.action === 'stopReload') {
    api.alarms.clear(`reload-${request.tabId}`).then(() => {
      delete activeTabs[request.tabId];
      sendResponse({status: "Reload stopped for tab: " + request.tabId});
    });
  } else if (request.action === 'getActiveTabs') {
    sendResponse(Object.keys(activeTabs).map(key => ({
      tabId: key,
      interval: activeTabs[key].interval,
      count: activeTabs[key].count
    })));
  }
  return true;  // Required for asynchronous sendResponse
});

api.alarms.onAlarm.addListener(alarm => {
  let matches = alarm.name.match(/^reload-(\d+)$/);
  if (matches) {
    let tabId = parseInt(matches[1]);
    if (tabId in activeTabs) {
      api.tabs.reload(tabId);
      activeTabs[tabId].count++; // Increment the counter each time the tab is reloaded
    }
  }
});
