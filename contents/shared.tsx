import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, type FC } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://chatgpt.com/*", "https://claude.ai/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const AIAssistantButton: FC = () => {
  const handleClick = () => {
    alert('AI Assistant Button Clicked!')
    // Add your button functionality here
  }

  return (
    <button 
      className="ai-assistant-button"
      onClick={handleClick}>
      <span className="button-text">AI Assistant</span>
    </button>
  )
}

const ContentScript = () => {
  useEffect(() => {
    const injectButton = () => {
      const currentURL = window.location.href
      
      if (currentURL.includes('chat.openai.com')) {
        // ChatGPT injection
        const savePdfContainer = document.querySelector('.chatGptToPdf-btn-group')
        if (savePdfContainer && !savePdfContainer.querySelector('.ai-assistant-button')) {
          const container = document.createElement('div')
          container.className = 'plasmo-csui-container'
          savePdfContainer.insertBefore(container, savePdfContainer.querySelector('#chatGptToPdf-dropdown-toggle'))
        }
      } else if (currentURL.includes('claude.ai')) {
        // Claude AI injection
        const claudeTarget = document.querySelector('header')
        if (claudeTarget && !document.querySelector('.plasmo-csui-container')) {
          const container = document.createElement('div')
          container.className = 'plasmo-csui-container'
          claudeTarget.appendChild(container)
        }
      }
    }

    // Initial injection
    injectButton()

    // Watch for dynamic content changes
    const observer = new MutationObserver(() => {
      injectButton()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  return <AIAssistantButton />
}

export default ContentScript