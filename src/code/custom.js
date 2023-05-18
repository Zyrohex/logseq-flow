/*
function pageRefClass() {
  // Create a <style> element
  const style = document.createElement('style');
  // Set the content of the <style> element
  style.innerHTML = `
    .folder-ref:before {
      content: "";
	  color: var(--ls-primary-text-color);
    }
  `;
  // Append the <style> element to the <head> of the document
  document.head.appendChild(style);

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        // Select all elements with class ".page-ref"
        const pageRefs = node.querySelectorAll('.page-ref');

        for (const pageRef of pageRefs) {
          // Get the value of the 'data-ref' attribute
          const attributeValue = pageRef.getAttribute('data-ref');

          // Check if the attribute value starts with "root/"
          if (attributeValue && attributeValue.startsWith('root/')) {
            // Add the new class "single-page-ref" to the element
            pageRef.classList.add('folder-ref');
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

function gardenRef() {
  // Create a <style> element
  const style = document.createElement('style');
  // Set the content of the <style> element
  style.innerHTML = `
    .garden-ref:before {
      content: "";
    }
  `;
  // Append the <style> element to the <head> of the document
  document.head.appendChild(style);

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        // Select all elements with class ".page-ref"
        const pageRefs = node.querySelectorAll('.page-ref');

        for (const pageRef of pageRefs) {
          // Get the value of the 'data-ref' attribute
          const attributeValue = pageRef.getAttribute('data-ref');

          // Check if the attribute value starts with "/"
          if (attributeValue && attributeValue.startsWith('garden/')) {
            // Add the new class "single-page-ref" to the element
            pageRef.classList.add('garden-ref');
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

function collapseNamespaceRefs() {

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;
        const namespaceRefs = node.querySelectorAll(
          '.ls-block a.page-ref[data-ref*="/"], span[data-ref*="/"], span[data-ref*="/"].title, .foldable-title [data-ref*="/"], li[title*="root/"] .page-title'
        );
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const testText = namespaceRef.classList.contains("tag")
            ? text.substring(1).toLowerCase()
            : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;
          // Perform collapsing.
          const content = `${text.substring(text.lastIndexOf("/") + 1)}`;
          namespaceRef.dataset.origText = text;
          namespaceRef.textContent = content;
        }
      }
    }
  });

  observer.observe(document.getElementById("app-container"), {
    subtree: true,
    childList: true,
  });
}

function propertyRef() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        // Select all elements with class ".block-properties"
        const blockProperties = node.querySelectorAll('.block-properties');

        for (const blockProperty of blockProperties) {
          let currentElement = blockProperty;
          let levelsUp = 6;

          // Traverse 6 levels up in the DOM tree
          while (levelsUp > 0 && currentElement.parentElement) {
            currentElement = currentElement.parentElement;
            levelsUp--;
          }

          // Add the new class ".contains-properties" to the element
          if (levelsUp === 0) {
            currentElement.classList.add('contains-properties');
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


function collapseSpanPages() {

  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;
        const namespaceRefs = node.querySelectorAll(
          'span[data-ref*="/"].page-reference'
        );
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const testText = namespaceRef.classList.contains("tag")
            ? text.substring(1).toLowerCase()
            : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;
          // Perform collapsing.
          const content = `${text.substring(text.lastIndexOf("/") + 1)}`;
          namespaceRef.dataset.origText = text;
          namespaceRef.textContent = content;
        }
      }
    }
  });

  observer.observe(document.getElementById("app-container"), {
    subtree: true,
    childList: true,
  });
}

function pageTitleBreadcrumb() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;

        // Select all elements with class ".foldable-title a.page-ref"
        const pageRefs = node.querySelectorAll('.foldable-title a.page-ref');

        for (const pageRef of pageRefs) {
          let currentElement = pageRef;
          let levelsUp = 6;

          // Traverse 6 levels up in the DOM tree
          while (levelsUp > 0 && currentElement.parentElement) {
            currentElement = currentElement.parentElement;
            levelsUp--;
          }

          // Create a new div element with class ".title-breadcrumb" and pre-append it to the ".initial > div > .breadcrumb" location
          if (levelsUp === 0 && currentElement.classList.contains('flex') && currentElement.classList.contains('flex-col')) {
            const breadcrumb = currentElement.querySelector('.initial > div > .breadcrumb');
            if (breadcrumb) {
              const titleBreadcrumb = document.createElement('div');
              titleBreadcrumb.classList.add('title-breadcrumb');

              // Copy the original data-ref value
              const originalDataRef = pageRef.getAttribute('data-ref');
              titleBreadcrumb.setAttribute('data-ref', originalDataRef);

              // Display the data-ref value as text inside the div
              titleBreadcrumb.textContent = originalDataRef;

              // Pre-append the new div element
              breadcrumb.insertBefore(titleBreadcrumb, breadcrumb.firstChild);
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

function abbreviateNamespace() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;
        const namespaceRefs = node.querySelectorAll(
          '.ls-block a.page-ref[data-ref*="/"], .foldable-title [data-ref*="/"], li[title*="root/"] .page-title'
        );
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const testText = namespaceRef.classList.contains("tag")
            ? text.substring(1).toLowerCase()
            : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;

          // Perform collapsing.
          const abbreviatedText = text.split('/').map((part, index, arr) => {
            if (index === arr.length - 1) {
              return part;
            } else {
              return part.charAt(0);
            }
          }).join('/');

          namespaceRef.dataset.origText = text;
          namespaceRef.textContent = abbreviatedText;

          // Show entire string on hover
          namespaceRef.addEventListener('mouseenter', () => {
            namespaceRef.textContent = namespaceRef.dataset.origText;
          });

          namespaceRef.addEventListener('mouseleave', () => {
            namespaceRef.textContent = abbreviatedText;
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

function abbreviateNamespaceTags() {
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        if (!node.querySelectorAll) continue;
        const namespaceRefs = node.querySelectorAll(
          'a.tag[data-ref*="/"]'
        );
        for (const namespaceRef of namespaceRefs) {
          const text = namespaceRef.textContent;
          const testText = namespaceRef.classList.contains("tag")
            ? text.substring(1).toLowerCase()
            : text.toLowerCase();
          if (testText !== namespaceRef.dataset.ref) continue;

          // Perform collapsing.
          const abbreviatedText = text.split('/').map((part, index, arr) => {
            if (index === arr.length - 1) {
              return part;
            } else if (index === 0) {
              return part.substring(0, 2);
            } else {
              return part.charAt(0);
            }
          }).join('/');

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
*/

function noteBlock() {
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
}

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

function indexBlocks() {
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

collapseAndAbbreviateNamespaceRefs();
noteBlock();
indexBlocks();
// propertyRef();
// pageRefClass();
// gardenRef();