// /* global chrome */
// console.log('Background script loaded');

// let pendingSignRequest = null;
// let popupWindowId = null;

// chrome.runtime.onInstalled.addListener(() => {
//   console.log('Wootz Wallet extension installed');
// });

// function openPopup() {
//   if (popupWindowId === null) {
//     chrome.windows.create({
//       url: chrome.runtime.getURL("index.html"),
//       type: "popup",
//       width: 400,
//       height: 600
//     }, (window) => {
//       popupWindowId = window.id;
//     });
//   } else {
//     chrome.windows.update(popupWindowId, { focused: true });
//   }
// }

// chrome.wootz.onSignMessageRequested.addListener((request) => {
//   console.log('Sign message request received in background:', request);
//   pendingSignRequest = request;
//   chrome.action.setBadgeText({text: '!'});
//   chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
//   openPopup();
// });

// chrome.windows.onRemoved.addListener((windowId) => {
//   if (windowId === popupWindowId) {
//     popupWindowId = null;
//   }
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('Message received in background:', message);
//   if (message.type === 'popupReady') {
//     if (pendingSignRequest) {
//       sendResponse({type: 'signMessageRequest', data: pendingSignRequest});
//       pendingSignRequest = null;
//       chrome.action.setBadgeText({text: ''});
//     } else {
//       sendResponse({type: 'noRequest'});
//     }
//   } else if (message.type === 'signMessage') {
//     console.log('Forwarding sign message request to wootz API');
//     chrome.wootz.signMessage(message.requestId, message.approved, message.signature, (result) => {
//       console.log('Sign message result:', result);
//       sendResponse(result);
//     });
//     return true; // Indicates that the response is sent asynchronously
//   }
// });
/* global chrome */
console.log('Background script loaded');

let pendingSignRequest = null;
let extensionTabId = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Wootz Wallet extension installed');
});

function openExtensionPage() {
  console.log('Attempting to open extension page...');
  const extensionUrl = chrome.runtime.getURL('index.html');
  console.log('Extension URL:', extensionUrl);
  
  if (extensionTabId === null) {
    console.log('No existing tab, creating new tab...');
    chrome.tabs.create({ url: extensionUrl }, (tab) => {
      extensionTabId = tab.id;
      console.log('New tab created with ID:', extensionTabId);
    });
  } else {
    console.log('Existing tab found, attempting to update tab with ID:', extensionTabId);
    chrome.tabs.update(extensionTabId, { active: true }, (tab) => {
      if (chrome.runtime.lastError) {
        console.log('Error updating existing tab:', chrome.runtime.lastError);
        console.log('Creating new tab instead...');
        chrome.tabs.create({ url: extensionUrl }, (newTab) => {
          extensionTabId = newTab.id;
          console.log('New tab created with ID:', extensionTabId);
        });
      } else {
        console.log('Existing tab updated successfully');
      }
    });
  }
}

chrome.wootz.onSignMessageRequested.addListener((request) => {
  console.log('Sign message request received in background:', request);
  pendingSignRequest = request;
  console.log('Setting badge text...');
  chrome.action.setBadgeText({text: '!'});
  chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
  console.log('Badge set. Opening extension page...');
  openExtensionPage();
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Tab removed:', tabId);
  if (tabId === extensionTabId) {
    console.log('Extension tab was closed. Resetting extensionTabId.');
    extensionTabId = null;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  if (message.type === 'popupReady') {
    console.log('Popup ready message received');
    if (pendingSignRequest) {
      console.log('Pending sign request found. Sending to popup...');
      sendResponse({type: 'signMessageRequest', data: pendingSignRequest});
      pendingSignRequest = null;
      chrome.action.setBadgeText({text: ''});
      console.log('Sign request sent and badge cleared');
    } else {
      console.log('No pending sign request');
      sendResponse({type: 'noRequest'});
    }
  } else if (message.type === 'signMessage') {
    console.log('Sign message request received from popup');
    chrome.wootz.signMessage(message.requestId, message.approved, message.signature, (result) => {
      console.log('Sign message result:', result);
      sendResponse(result);
    });
    return true; // Indicates that the response is sent asynchronously
  }
});

// Log when the background script is unloaded (for debugging purposes)
chrome.runtime.onSuspend.addListener(() => {
  console.log('Background script is being unloaded');
});