function pageRefClass() {
  // Create a <style> element
  const style = document.createElement('style');
  // Set the content of the <style> element
  style.innerHTML = `
    .single-page-ref:before {
      content: "📂 ";
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
            pageRef.classList.add('single-page-ref');
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
      content: "🪴 ";
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
          if (attributeValue && attributeValue.startsWith('z/')) {
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
            '.ls-block a.page-ref[data-ref*="/"], span[data-ref*="/"].title, .foldable-title [data-ref*="/"], li[title*="root/"] .page-title'
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

collapseNamespaceRefs();
pageRefClass();
gardenRef();