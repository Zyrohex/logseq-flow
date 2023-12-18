function collapseAndAbbreviateNamespaceRefs() {
  const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
          for (const node of mutation.addedNodes) {
              if (!node.querySelectorAll) continue;

              const initialNamespaceRefs = node.querySelectorAll(
                  '.ls-block a.page-ref[data-ref*="/"], .foldable-title .page-ref[data-ref*="/"], li[title*="root/"] .page-title, a.tag[data-ref*="/"]'
              );
              const pageTitleRefs = node.querySelectorAll('.page-title');
              const filteredPageTitleRefs = Array.from(pageTitleRefs).filter((pageTitleRef) =>
                  Array.from(pageTitleRef.childNodes).some((child) => child.nodeType === 3 && child.textContent.includes('/'))
              );
              const namespaceRefs = [...initialNamespaceRefs, ...filteredPageTitleRefs];

              for (const namespaceRef of namespaceRefs) {
                  const text = namespaceRef.textContent;
                  const testText = namespaceRef.classList.contains("tag")
                      ? text.substring(1).toLowerCase()
                      : text.toLowerCase();
                  if (testText !== namespaceRef.dataset.ref) continue;

                  // Perform collapsing.
                  let abbreviatedText;
                  if (namespaceRef.classList.contains("tag")) {
                      const parts = text.split('/');
                      abbreviatedText = "#" + parts[parts.length - 1]; // Retain the '#' and get the last part of the path
                  } else {
                      const parts = text.split('/');
                      abbreviatedText = parts[parts.length - 1];
                  }

                  namespaceRef.dataset.origText = text;
                  namespaceRef.textContent = abbreviatedText;
              }
          }
      }
  });

  observer.observe(document.getElementById("app-container"), {
      subtree: true,
      childList: true,
  });
}

collapseAndAbbreviateNamespaceRefs();

function updatePageReferencesWithCurrentClass() {
  const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
              updateCurrentPageRefs();
          }
      }
  });

  function updateCurrentPageRefs() {
      const titleBlock = document.querySelector('.title.block');
      if (!titleBlock) return;

      const titleText = titleBlock.textContent.trim().toLowerCase();
      const pageRefs = document.querySelectorAll('.ls-block .page-ref');

      // Add or remove "current-page-ref" class based on matching with ".title.block" value
      pageRefs.forEach((pageRef) => {
          const dataRef = pageRef.getAttribute('data-ref').toLowerCase();
          if (dataRef === titleText) {
              pageRef.classList.add('current-page-ref');
          } else {
              pageRef.classList.remove('current-page-ref');
          }
      });
  }

  observer.observe(document.body, {
      subtree: true,
      childList: true,
  });

  // Apply the class to the elements immediately and also check for any mismatches
  updateCurrentPageRefs();
}

// Initialize the function to start observing and update classes accordingly
updatePageReferencesWithCurrentClass();

function updatePageReferencesWithSiblingClasses() {
  const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
              updatePageReferences();
          }
      }
  });

  function updatePageReferences() {
      const inlineElements = document.querySelectorAll('.inline');

      inlineElements.forEach((inline) => {
          const children = Array.from(inline.childNodes).filter(child => 
              child.nodeType !== Node.TEXT_NODE || child.textContent.trim()
          );

          if (children.length < 2) {
              return;
          }

          const firstChild = children[0];
          const secondChild = children[1];

          if (firstChild.nodeType === Node.ELEMENT_NODE && 
              firstChild.classList.contains('page-reference') && 
              secondChild.nodeType === Node.TEXT_NODE) {
              firstChild.classList.add('concept-block');

              let ancestor = firstChild;
              for (let i = 0; i < 9; i++) {
                  if (ancestor.parentNode) {
                      ancestor = ancestor.parentNode;
                  } else {
                      // If there's no 9th ancestor, break out of the loop
                      break;
                  }
              }

              // Add 'is-concept' class if we successfully traversed 9 levels up
              if (ancestor.nodeType === Node.ELEMENT_NODE) {
                  ancestor.classList.add('is-concept');
              }
          }
      });
  }

  observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
  });

  // Apply the class to the elements immediately and also check for any mismatches
  updatePageReferences();
}

// Call the function to initialize
updatePageReferencesWithSiblingClasses();

function updateBlockRefParentClass() {
  const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
              updateBlockRefParents();
          }
      }
  });

  function updateBlockRefParents() {
      const blockRefElements = document.querySelectorAll('.block-ref-wrap');

      blockRefElements.forEach((blockRef) => {
          let parent = blockRef;
          for (let i = 0; i < 9; i++) {
              if (parent.parentElement) {
                  parent = parent.parentElement;
              } else {
                  // Break early if there are not enough parent elements
                  return;
              }
          }
          parent.classList.add('is-block-ref');
      });
  }

  observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
  });

  // Apply the class to the elements immediately and also check for any mismatches
  updateBlockRefParents();
}

// Call the function to initialize
updateBlockRefParentClass();

function updatePageReferencesWithDescriptorBlock() {
  const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
              updatePageReferences();
          }
      }
  });

  function updatePageReferences() {
      const inlineElements = document.querySelectorAll('.inline');
  
      inlineElements.forEach((inline) => {
          const children = Array.from(inline.childNodes).filter(child => 
              child.nodeType !== Node.TEXT_NODE || child.textContent.trim()
          );
  
          if (children.length < 2) {
              return;
          }
  
          const firstChild = children[0];
          const secondChild = children[1];
  
          // Check if the first child is an <i> element and the second child is a text node
          if (firstChild.nodeType === Node.ELEMENT_NODE && firstChild.tagName === 'I' && 
              secondChild.nodeType === Node.TEXT_NODE) {
              // Add the class 'descriptor-block' to the <i> element
              firstChild.classList.add('descriptor-block');
  
              let ancestor = firstChild;
              for (let i = 0; i < 9; i++) {
                  if (ancestor.parentNode) {
                      ancestor = ancestor.parentNode;
                  } else {
                      // If there's no 9th ancestor, break out of the loop
                      break;
                  }
              }
  
              // Add 'is-descriptor' class if we successfully traversed 9 levels up
              if (ancestor.nodeType === Node.ELEMENT_NODE) {
                  ancestor.classList.add('is-descriptor');
              }
          }
      });
  }

  observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
  });

  // Apply the class to the elements immediately and also check for any mismatches
  updatePageReferences();
}

// Call the function to initialize
updatePageReferencesWithDescriptorBlock();

function updatePageReferencesWithCollectorBlock() {
  const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
              updatePageReferences();
          }
      }
  });

  function updatePageReferences() {
      const inlineElements = document.querySelectorAll('.inline');

      inlineElements.forEach((inline) => {
          const children = Array.from(inline.childNodes);

          // Check if there is exactly one element child and no text node siblings
          const hasOnlyOneChildElement = children.length === 1 && children[0].nodeType === Node.ELEMENT_NODE;
          const noTextNodeSiblings = !children.some(child => child.nodeType === Node.TEXT_NODE && child.textContent.trim());

          if (hasOnlyOneChildElement && noTextNodeSiblings) {
              const childElement = children[0];

              if (childElement.classList.contains('page-reference')) {
                  childElement.classList.add('collector-block');

                  let ancestor = childElement;
                  for (let i = 0; i < 9; i++) {
                      if (ancestor.parentNode) {
                          ancestor = ancestor.parentNode;
                      } else {
                          // If there's no 9th ancestor, break out of the loop
                          break;
                      }
                  }

                  // Add 'is-collector' class if we successfully traversed 9 levels up
                  if (ancestor.nodeType === Node.ELEMENT_NODE) {
                      ancestor.classList.add('is-collector');
                  }
              }
          }
      });
  }

  observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
  });

  // Apply the class to the elements immediately and also check for any mismatches
  updatePageReferences();
}

// Call the function to initialize
updatePageReferencesWithCollectorBlock();

function updateRefTitles() {

  function cloneRefPanel() {
      let primaryRefTitle = top.document.querySelector('.relative>div>.lazy-visibility>div>.fade-enter>.references>.content>.flex.flex-col>.content');
      
      // Check if the element exists before attempting to clone
      if (primaryRefTitle) {
          console.log(primaryRefTitle);
          console.log('Cloning element');

          let clone = primaryRefTitle.cloneNode(true);
          primaryRefTitle.parentNode.insertBefore(clone, primaryRefTitle.nextSibling);
      } else {
          console.log('Element not found');
      }
  }

  // Execute cloneRefPanel after DOM has fully loaded
  document.addEventListener('DOMContentLoaded', function () {
      cloneRefPanel();
  });
}

// Call the function to initialize
updateRefTitles();