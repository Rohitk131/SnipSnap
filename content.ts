console.log("Content script loaded!");

// Add a custom button to the ChatGPT or Claude UI
const addCustomButton = () => {
  // Prevent multiple buttons from being added
  if (document.getElementById("snip-snap-btn")) return;

  const button = document.createElement("button");
  button.id = "snip-snap-btn";
  button.textContent = "Save Chat Link";
  button.style.position = "fixed";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.style.padding = "10px 20px";
  button.style.zIndex = "9999";
  button.style.backgroundColor = "#1d4ed8"; // Tailwind Blue
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";

  button.addEventListener("click", () => {
    const url = window.location.href;
    chrome.runtime.sendMessage({ type: "SAVE_LINK", url }, (response) => {
      console.log(response.message);
    });
  });

  document.body.appendChild(button);
};

// Run the function
addCustomButton();
