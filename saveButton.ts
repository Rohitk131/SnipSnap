// Check if the current page is ChatGPT or Claude
if (window.location.href.includes("chatgpt.com") || window.location.href.includes("claude.ai")) {
    // Add a button to save the current conversation link
    const saveButton = document.createElement("button");
    saveButton.innerText = "Save Link to Extension";
    saveButton.style.position = "fixed";
    saveButton.style.bottom = "20px";
    saveButton.style.right = "20px";
    saveButton.style.backgroundColor = "#4caf50";
    saveButton.style.color = "white";
    saveButton.style.padding = "10px 20px";
    saveButton.style.border = "none";
    saveButton.style.borderRadius = "5px";
    saveButton.style.cursor = "pointer";
  
    saveButton.addEventListener("click", () => {
      const currentURL = window.location.href;
      chrome.runtime.sendMessage({ action: "saveLink", url: currentURL });
    });
  
    document.body.appendChild(saveButton);
  }