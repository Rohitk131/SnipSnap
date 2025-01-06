chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "injectSaveButton") {
      // Inject the save button into the page
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("saveButton.js");
      document.body.appendChild(script);
    } else if (request.action === "saveLink") {
      // Save the link to Firebase or local storage
      const uid = chrome.runtime.getStorageSync("uid");
      saveLinkToFirebase(uid, request.url);
    }
  });