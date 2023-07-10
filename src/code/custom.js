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

// Process all elements
function processAllElements() {
  // Process elements that are present at the time of page load
  processBlockElements(document.querySelectorAll('.ls-block .inline'));
  processBreadcrumbElements(document.querySelectorAll('.breadcrumb .inline-wrap'));
}

// Function to process existing elements
function processBlockElements(blockPropertiesElements) {
  for (const blockElement of blockPropertiesElements) {
    // Search through all text nodes in the current blockElement
    const walker = document.createTreeWalker(blockElement, NodeFilter.SHOW_TEXT);
    let textNode;

    while (textNode = walker.nextNode()) {
      let textContent = textNode.textContent;
      
      // Determine the symbol, class to remove/add, and new element
      let symbol, classToManipulate, newElement;
      if (textContent.includes(':-')) {
        symbol = ':-';
        classToManipulate = 'concept-block';
        newElement = null; // no specific element for ":-"
      }

      // Find the ancestor element
      let ancestorElement = blockElement.closest('.ls-block');

      if (ancestorElement) {
        // If the textContent includes one of the symbols ':-', ':-', '!-', add the class
        // otherwise, remove the class
        if (!textContent.includes(':-') && !textContent.includes(';-') && !textContent.includes('!-')) {
          ancestorElement.classList.remove(classToManipulate);
        } else {
          ancestorElement.classList.add(classToManipulate);
        }
      }

      // Split the text content by symbol and trim extra spaces
      let parts = textContent.split(symbol);

      // If text was successfully split into two parts
      if(parts.length === 2) {
        textNode.textContent = ''; // clear the current text content
        let followingText = parts[1];
        if (newElement) {
          textNode.parentNode.insertBefore(document.createElement(newElement).appendChild(document.createTextNode(parts[0])), textNode.nextSibling);
          textNode.parentNode.insertBefore(document.createTextNode(followingText), textNode.nextSibling);
        } else {
          textNode.parentNode.insertBefore(document.createTextNode(parts[0] + followingText), textNode.nextSibling);
        }
      }
    }
  }
}

// Function to remove :-, ;- and !- from breadcrumb elements
function processBreadcrumbElements(breadcrumbElements) {
  for (const breadcrumbElement of breadcrumbElements) {
    let textContent = breadcrumbElement.textContent;
    // Replace :-, ;- and !- with empty string
    textContent = textContent.replace(/:-|;-|!-/g, '');
    breadcrumbElement.textContent = textContent;
  }
}

// Function to add the descriptor-block class
function processDescriptorBlocks() {
  // Find all concept-block elements
  let conceptBlocks = document.querySelectorAll('.concept-block');
  
  for (const conceptBlock of conceptBlocks) {
    // Find all child ls-block elements
    let childBlocks = conceptBlock.querySelectorAll('.ls-block');

    for (const childBlock of childBlocks) {
      // If the childBlock is not also a concept-block, add the descriptor-block class
      if (!childBlock.classList.contains('concept-block')) {
        childBlock.classList.add('descriptor-block');
      }
    }
  }
}

function indexBlocks3() {
  processAllElements();
  processDescriptorBlocks();

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (!node.querySelectorAll) continue;
          processBlockElements(node.querySelectorAll('.ls-block .inline'));
          processBreadcrumbElements(node.querySelectorAll('.breadcrumb .inline-wrap'));
          processDescriptorBlocks();
        }
      } else if (mutation.type === 'characterData') {
        processAllElements();
        processDescriptorBlocks();
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
    characterData: false,
  });
}

indexBlocks3();
collapseAndAbbreviateNamespaceRefs();
