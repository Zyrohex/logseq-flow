// Abbreviate namespace
// Eample: "root/foo/bar" -> "r/f/bar"
function abbreviate(text, isTag) {
  return text
    .split("/")
    .map((part, index, arr) => {
      if (index === arr.length - 1) {
        return part; // return the last part unabbreviated
      } else {
        return part
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join(""); // abbreviate other parts and capitalize
      }
    })
    .join("/");
}

function abbreviateNamespace(selector) {
  const appContainer = document.getElementById("app-container");

  const handleNamespaceHover = (event) => {
    const namespaceRef = event.target.closest(selector);
    if (!namespaceRef) return;

    if (event.type === "mouseenter") {
      namespaceRef.textContent = namespaceRef.dataset.origText;
    } else if (event.type === "mouseleave") {
      namespaceRef.textContent = namespaceRef.dataset.abbreviatedText;
    }
  };

  appContainer.addEventListener("mouseenter", handleNamespaceHover, true);
  appContainer.addEventListener("mouseleave", handleNamespaceHover, true);

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const namespaceRefs = node.querySelectorAll(selector);
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const isTag = namespaceRef.classList.contains("tag");
          const testText = isTag
            ? text.substring(1).toLowerCase()
            : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;

          const abbreviatedText = abbreviate(text, isTag);

          namespaceRef.dataset.origText = text;
          namespaceRef.dataset.abbreviatedText = abbreviatedText;
          namespaceRef.textContent = abbreviatedText;
        }
      }
    }
  });

  observer.observe(appContainer, {
    subtree: true,
    childList: true,
  });
}

abbreviateNamespace(
  '.ls-block a.page-ref[data-ref*="/"], .foldable-title [data-ref*="/"], li[title*="root/"] .page-title, a.tag[data-ref*="/"], .title[data-ref*="/"]'
);

function indexBlocks3() {
  // Function to process existing elements
  function processBlockElements(blockPropertiesElements) {
    for (const blockElement of blockPropertiesElements) {
      // Search through all text nodes in the current blockElement
      const walker = document.createTreeWalker(blockElement, NodeFilter.SHOW_TEXT);
      let textNode;

      while (textNode = walker.nextNode()) {
        let textContent = textNode.textContent;
        
        if (!textContent.includes(':-') && !textContent.includes(';-') && !textContent.includes('?-')) {
          continue;
        }

        // Determine the symbol, class to add, and new element
        let symbol, classToAdd, newElement;
        if (textContent.includes(':-')) {
          symbol = ':-';
          classToAdd = 'concept-block';
          newElement = 'strong';
        } else if (textContent.includes(';-')) {
          symbol = ';-';
          classToAdd = 'descriptor-block';
          newElement = 'em';
        } else if (textContent.includes('?-')) {
          symbol = '?-';
          classToAdd = 'question-block';
          newElement = 'em';
        }

        // Add the class to the ancestor element
        let ancestorElement = blockElement.closest('.ls-block');
        if(ancestorElement) {
          ancestorElement.classList.add(classToAdd);
        }

        // Split the text content by symbol and trim extra spaces
        let parts = textContent.split(symbol);

        // If text was successfully split into two parts
        if(parts.length === 2) {
          // Make the first part bold/italic, add " ― ", keep remaining text intact
          // And ensure the following text node starts with a space if it should
          textNode.textContent = '';
          let followingText = parts[1].startsWith(' ') ? parts[1] : ' ' + parts[1];
          textNode.parentNode.insertBefore(document.createTextNode(' ―' + followingText), textNode.nextSibling);
          textNode.parentNode.insertBefore(document.createElement(newElement).appendChild(document.createTextNode(parts[0].trim())).parentNode, textNode);
        }
      }
    }
  }

  // Process elements that are present at the time of page load
  processBlockElements(document.querySelectorAll('.ls-block .inline'));

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;
        processBlockElements(node.querySelectorAll('.ls-block .inline'));
      }
    }
  });

  let keyboardInputTimeout;
  let shouldProcessMutations = true;

  document.addEventListener('keydown', (event) => {
    clearTimeout(keyboardInputTimeout);
    keyboardInputTimeout = setTimeout(() => {
      shouldProcessMutations = false;
    }, 2000); // 2 seconds
  });

  document.addEventListener('keyup', (event) => {
    clearTimeout(keyboardInputTimeout);
    shouldProcessMutations = true;
  });

  observer.observe(document.getElementById("app-container"), {
    subtree: true,
    childList: true,
  });
}


indexBlocks3();
collapseAndAbbreviateNamespaceRefs();