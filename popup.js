function updateTabList() {
  const api = (typeof browser !== 'undefined') ? browser : chrome;
  api.tabs.query({}, function(tabs) {
    const tabSelect = document.getElementById('tabs');
    tabSelect.innerHTML = '';
    tabs.forEach(tab => {
      let option = document.createElement('option');
      option.value = tab.id;
      option.textContent = tab.title;
      tabSelect.appendChild(option);
    });
  });
}

function updateActiveTabsList() {
  const api = (typeof browser !== 'undefined') ? browser : chrome;
  api.runtime.sendMessage({ action: "getActiveTabs" }, function(response) {
    const listElement = document.getElementById('activeReloadingTabs');
    listElement.innerHTML = '';
    response.forEach(tabInfo => {
      let listItem = document.createElement('li');
      listItem.textContent = `ID: ${tabInfo.tabId}, Interval: ${tabInfo.interval}s, Count: ${tabInfo.count}`;
      listElement.appendChild(listItem);
    });
  });
}

document.getElementById('setReload').addEventListener('click', () => {
  const tabId = parseInt(document.getElementById('tabs').value);
  const interval = parseInt(document.getElementById('interval').value);
  if (isNaN(tabId) || interval <= 0) {
    alert('Veuillez sélectionner un onglet et entrer un intervalle positif.');
    return;
  }
  const api = (typeof browser !== 'undefined') ? browser : chrome;
  api.runtime.sendMessage({ action: "setReload", tabId: tabId, interval: interval }, response => {
    updateActiveTabsList();
    alert(response.status); // Ajout d'un feedback visuel pour l'utilisateur
  });
});

document.getElementById('stopReload').addEventListener('click', () => {
  const tabId = parseInt(document.getElementById('tabs').value);
  if (isNaN(tabId)) {
    alert('Veuillez sélectionner un onglet à arrêter.');
    return;
  }
  const api = (typeof browser !== 'undefined') ? browser : chrome;
  api.runtime.sendMessage({ action: "stopReload", tabId: tabId }, response => {
    updateActiveTabsList();
    alert(response.status); // Ajout d'un feedback visuel pour l'utilisateur
  });
});


document.addEventListener('DOMContentLoaded', function() {
  updateTabList();
  updateActiveTabsList();
});
