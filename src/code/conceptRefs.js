function updateRefTitles() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                cloneRefPanel(); // Call the function when a relevant mutation is observed
            }
        }
    });

    function cloneRefPanel() {
        let primaryRefTitle = top.document.querySelector('.relative>div>.lazy-visibility>div>.fade-enter>.references>.content>.flex.flex-col>.content');
        let refContents = top.document.querySelector('.relative>div>.lazy-visibility>div>.fade-enter>.references>.content>.flex.flex-col>.initial');
        let clonedElementExists = top.document.querySelector('.conceptRefs'); // Check if the cloned element already exists

        // Check if the element exists and if the clone does not already exist
        if (primaryRefTitle && !clonedElementExists) {
            console.log(primaryRefTitle);
            console.log('Cloning element');

            let clone = primaryRefTitle.cloneNode(true);
            clone.classList.add('conceptRefs'); // Add a class to identify the cloned element
            let cloneTitle = clone.querySelector('.foldable-title .font-medium')
            let conceptRefs = refContents.querySelectorAll('.is-concept').length
            
            if (conceptRefs > 1) {
                cloneTitle.textContent = conceptRefs + ' Concept References'
            } else {
                cloneTitle.textContent = conceptRefs + ' Concept Reference'
            }

            if (conceptRefs >= 1) {
                primaryRefTitle.parentNode.appendChild(clone, primaryRefTitle.nextSibling);
            }
        } else if (clonedElementExists) {
            console.log('Cloned element already exists');
        } else {
            console.log('Element not found');
        }
    }

    function moveConceptRefs() {
        // Create our variables that captures our root Concepts Section AND all concept references
        let conceptRefSection = top.document.querySelector('.conceptRefs')
        let RefElements = top.document.querySelectorAll('.relative>div>.lazy-visibility>div>.fade-enter>.references>.content>.flex.flex-col>.initial>div');

        let conceptRefs = top.document.querySelectorAll('.is-concept')
        console.log(RefElements.length + conceptRefs.length)
    }

    observer.observe(document.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: false // Added to explicitly observe attribute changes
    });

    cloneRefPanel(); // Call the function initially to clone the element
    moveConceptRefs();
}

// Call the function to initialize
updateRefTitles();