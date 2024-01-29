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

function updatePageReferencesWithSiblingClasses() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                updatePageReferences();
            }
        }
    });

    function updatePageReferences() {
        const lsblockElements = document.querySelectorAll('.ls-block > .block-main-container')
        lsblockElements.forEach((lsblock) => {
            const blockElements = lsblock.querySelectorAll('.block-content');
            blockElements.forEach((block) => {
                // Use querySelector to find .inline elements within the block
                const inlineElements = block.querySelectorAll('.block-content-inner > .flex-1 > .inline');

                inlineElements.forEach(inlineElement => {
                    // Additional condition for .page-reference within .inline elements
                    if (inlineElement && inlineElement.children.length === 1 && inlineElement.querySelector('.page-reference')) {
                        const blockBody = block.querySelector('.block-body');
                        if (blockBody) {
                            // If the conditions are met, add the classes as needed
                            inlineElement.querySelector('.page-reference').classList.add('concept-block');
                            lsblock.parentNode.classList.add('is-concept');
                        }
                    }
                });
            });
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
updatePageReferencesWithSiblingClasses();

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

            if (children.length === 1 && children[0].nodeType === Node.ELEMENT_NODE) {
                let ancestor = inline;
                for (let i = 0; i < 8; i++) {
                    if (ancestor.parentNode) {
                        ancestor = ancestor.parentNode;
                    } else {
                        break;
                    }
                }

                // Check if the single child element is <i> and assign 'is-descriptor'
                if (children[0].tagName === 'I' && ancestor.nodeType === Node.ELEMENT_NODE) {
                    ancestor.classList.add('is-descriptor');
                }

                // Check if the single child element is <b> with a child having class '.page-reference' and assign 'is-foundation'
                if (children[0].tagName === 'B' && ancestor.nodeType === Node.ELEMENT_NODE) {
                    const bElement = children[0];
                    if (bElement.querySelector('.page-reference')) {
                        ancestor.classList.add('is-foundation');
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
updatePageReferencesWithDescriptorBlock();

function updateAndRemoveTaggedReferences() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                findAllMatchedElements();
            }
        }
    });

    function findAllMatchedElements() {
        let pageNameElement = parent.document.querySelector('.title .title').getAttribute('data-ref')
        let allPageReferences = parent.document.querySelectorAll('.references-blocks-wrap')
        let pageRef = parent.document.querySelectorAll('.references-blocks-wrap>.lazy-visibility')

        // Iterate through each page element
        for (let page of pageRef) {
            let matchedReferences = 0;
            let matchedTagged = 0
            let matchedRefElement = null;
            // Iterate through each block references
            let allReferences = page.querySelectorAll('.references-blocks-wrap .page-ref')
            let currentReferences = Array.from(allReferences).filter(el => el.innerText.trim().toLowerCase().includes(pageNameElement.toLowerCase()));
            for (let currentRef of currentReferences) {
                let currentClassList = currentRef.parentNode.parentNode
                if (currentClassList.classList.contains('page-reference')) {
                    matchedReferences += 1
                }
                else if (currentClassList.classList.contains('page-property-value')) {
                    matchedTagged += 1
                    // set 11 parent levels up
                    let matchedRefElement = currentClassList;
                    // Loop 11 times to move up 11 levels
                    for (let i = 0; i < 11; i++) {
                        if (matchedRefElement.parentNode) {
                            matchedRefElement = matchedRefElement.parentNode;
                        }
                    }
                    removeElement(matchedRefElement)
                }
                if (matchedTagged >= 1 & matchedReferences == 0) {
                    removeElement(page)
                }
                console.log(matchedReferences, matchedTagged)
            }
        }
    }

    function removeElement(element) {
        if (element && element.parentNode) {  // Check if the element exists and has a parent
            element.parentNode.removeChild(element);
        }
    }

    observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
    });

    findAllMatchedElements();
}

updateAndRemoveTaggedReferences();

/*function updatePageReferencesWithCurrentClass() {
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
*/

/*function updateBlockRefParentClass() {
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
updateBlockRefParentClass();*/

/*function updatePageReferencesWithCollectorBlock() {
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
updatePageReferencesWithCollectorBlock();*/

/*function updateRefTitles() {

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
updateRefTitles();*/

/*function updatePageReferencesWithQuestionBlock() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                updatePageReferences();
            }
        }
    });

    function updatePageReferences() {
        const inlineElements = document.querySelectorAll('.inline');
        const questionWords = ["What", "Where", "How", "When", "Why", "Who", "Which", "Whose", "Are", "Can", "Could", "Would", "Should", "Do", "Does", "Did", "Is", "Are", "Was", "Were"]; // Add more as needed

        inlineElements.forEach((inline) => {
            const children = Array.from(inline.childNodes).filter(child =>
                child.nodeType === Node.TEXT_NODE && child.textContent.trim()
            );

            // Check if the first child is a TEXT_NODE and starts with a question word followed by a "?"
            if (children.length > 0 && children[0].nodeType === Node.TEXT_NODE) {
                const textContent = children[0].textContent.trim();
                const startsWithQuestionWord = questionWords.some(word => textContent.startsWith(word));
                const endsWithQuestionMark = textContent.endsWith("?");

                if (startsWithQuestionWord && endsWithQuestionMark) {
                    let ancestor = inline;
                    for (let i = 0; i < 8; i++) { // Adjusted to 9 to go up 9 levels
                        if (ancestor.parentNode) {
                            ancestor = ancestor.parentNode;
                        } else {
                            // If there's no 9th ancestor, break out of the loop
                            break;
                        }
                    }

                    // Add 'is-question' class if we successfully traversed 9 levels up
                    if (ancestor.nodeType === Node.ELEMENT_NODE) {
                        ancestor.classList.add('is-question');
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
updatePageReferencesWithQuestionBlock();*/

/*function updateHeadlineBlocks() {
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

            if (children.length === 1 && children[0].nodeType === Node.ELEMENT_NODE) {
                let ancestor = inline;
                for (let i = 0; i < 8; i++) {
                    if (ancestor.parentNode) {
                        ancestor = ancestor.parentNode;
                    } else {
                        break;
                    }
                }

                // Check if the single child element is an h2 element
                if (children[0].tagName === 'H2' && ancestor.nodeType === Node.ELEMENT_NODE) {
                    ancestor.classList.add('some-class'); // Replace 'some-class' with the class you want to add
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
updateHeadlineBlocks();
*/