/*function noteBlock() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const matchingFlexElements = node.querySelectorAll('.flex-1');

        for (const flexElement of matchingFlexElements) {
          const initialElement = flexElement.querySelector('.initial');
          if (initialElement) {
            const divElement = initialElement.querySelector('div');
            if (divElement) {
              const tagElement = divElement.querySelector('.tag');

              if (tagElement) {
                const noteBlockElement = document.createElement('div');
                noteBlockElement.classList.add('note-block');
                noteBlockElement.appendChild(tagElement.cloneNode(true));

                flexElement.insertBefore(noteBlockElement, initialElement);
                tagElement.remove();
              }
            }
          }
        }
      }
    }
  });

  observer.observe(document.getElementById("app-container"), {
    subtree: true,
    childList: true,
  });
}*/

function collapseAndAbbreviateNamespaceRefs() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const initialNamespaceRefs = node.querySelectorAll(
          '.ls-block a.page-ref[data-ref*="/"], span[data-ref*="/"].title, .foldable-title [data-ref*="/"], li[title*="root/"] .page-title, a.tag[data-ref*="/"]'
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

          const selectorToMatch = '.ls-block a.page-ref[data-ref*="/"], a.tag[data-ref*="/"], .foldable-title [data-ref*="/"]';
          const awLiIconElement = namespaceRef.matches(selectorToMatch) ? namespaceRef.parentElement.querySelector('.awLi-icon') : null;
          const awLiIcon = awLiIconElement ? awLiIconElement.textContent : null;

          // Perform collapsing.
          const parts = text.split('/').map((part, index, arr) => {
            if (awLiIcon && index === 0) {
              return awLiIcon;
            } else if (namespaceRef.matches('a.tag[data-ref*="/"]') && index === 0) {
              return part.substring(0, 2);
            } else if (index === arr.length - 1) {
              return part;
            } else {
              return part.charAt(0);
            }
          });

          namespaceRef.dataset.origText = text;
          namespaceRef.innerHTML = '';
          
          parts.forEach((part, index) => {
            const span = document.createElement('span');
            span.textContent = part;
            if (index !== 0) {
              const separator = document.createElement('span');
              separator.textContent = '/';
              separator.style.margin = '0 1px';
              namespaceRef.appendChild(separator);
            }
            namespaceRef.appendChild(span);
          });
        }
      }
    }
  });

  observer.observe(document.getElementById("app-container"), {
    subtree: true,
    childList: true,
  });
}

function indexBlocks2() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const blockPropertiesElements = node.querySelectorAll('.block-properties');

        for (const blockElement of blockPropertiesElements) {
          const indexRefElement = blockElement.querySelector('.page-ref[data-ref="index"]');
          if (indexRefElement) {
            const divElement = blockElement.querySelector('div');
            if (divElement) {
              divElement.classList.add('index-ref');
              divElement.style.display = 'none';
            }
          }
        }
      }
    }
  });

  observer.observe(document.getElementById("app-container"), {
    subtree: true,
    childList: true,
  });
}

let keyboardInputTimeout;
let shouldProcessMutations = true;

function indexBlocks2() {
  const observer = new MutationObserver((mutationList) => {
    if (!shouldProcessMutations) {
      return;
    }

    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const blockPropertiesElements = node.querySelectorAll('.block-properties');

        for (const blockElement of blockPropertiesElements) {
          const indexRefElement = blockElement.querySelector('.page-ref[data-ref="index"]');
          if (indexRefElement) {
            const divElement = blockElement.querySelector('div');
            if (divElement) {
              divElement.classList.add('index-ref');
              divElement.style.display = 'none';

              let ancestorElement = divElement;
              for(let i = 0; i < 7; i++) {
                if(ancestorElement.parentElement) {
                  ancestorElement = ancestorElement.parentElement;
                } else {
                  break;
                }
              }
              ancestorElement.classList.add('index-card');
            }
          }
        }
      }
    }
  });

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

function indexBlocks3() {
  const observer = new MutationObserver((mutationList) => {
    if (!shouldProcessMutations) {
      return;
    }

    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        const blockPropertiesElements = node.querySelectorAll('.block-property[data-ref="type"]');

        for (const blockElement of blockPropertiesElements) {
          const typeRefElement = blockElement;
          if (typeRefElement) {
            const divElement = blockElement.closest('div');
            if (divElement && divElement.parentElement) {
              divElement.parentElement.classList.add('type-ref');
              divElement.style.display = 'none';

              let ancestorElement = divElement;
              for(let i = 0; i < 8; i++) {
                if(ancestorElement.parentElement) {
                  ancestorElement = ancestorElement.parentElement;
                } else {
                  break;
                }
              }
              ancestorElement.classList.add('type-block');

              // Find the span with 'Project' data-ref and copy its data-ref to the ancestor element
              const propertyRefElement = node.querySelector('span.page-reference');
              if (propertyRefElement) {
                const propertyRefValue = propertyRefElement.getAttribute('data-ref');
                ancestorElement.setAttribute('data-ref', propertyRefValue);
              }
            }
          }
        }
      }
    }
  });

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

function indexBlocks3() {
  // Function to process existing elements
  function processBlockElements(blockPropertiesElements) {
    for (const blockElement of blockPropertiesElements) {
      const typeRefElement = blockElement;
      if (typeRefElement) {
        const divElement = blockElement.closest('div');
        if (divElement && divElement.parentElement) {
          divElement.parentElement.classList.add('type-ref');
          divElement.style.display = 'none';

          let ancestorElement = divElement;
          for(let i = 0; i < 8; i++) {
            if(ancestorElement.parentElement) {
              ancestorElement = ancestorElement.parentElement;
            } else {
              break;
            }
          }
          ancestorElement.classList.add('type-block');

          // Find any span with page-reference class under 'type-ref' class
          // and copy its data-ref to the ancestor element
          const pageRefElement = divElement.parentElement.querySelector('span.page-reference');
          if (pageRefElement) {
            const pageRefValue = pageRefElement.getAttribute('data-ref');
            ancestorElement.setAttribute('data-ref', pageRefValue);
          }
        }
      }
    }
  }

  // Process elements that are present at the time of page load
  processBlockElements(document.querySelectorAll('.block-property[data-ref="type"]'));

  const observer = new MutationObserver((mutationList) => {
    if (!shouldProcessMutations) {
      return;
    }

    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;
        processBlockElements(node.querySelectorAll('.block-property[data-ref="type"]'));
      }
    }
  });

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

// indexBlocks2();
indexBlocks3();
collapseAndAbbreviateNamespaceRefs();
// noteBlock();
// propertyRef();
// pageRefClass();
// gardenRef();