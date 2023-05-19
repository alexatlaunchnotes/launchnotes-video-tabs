const init = () => {
    console.log('loaded')

    // Select the node that will be observed for mutations
const tabsComponent = document.querySelector("[wb-data='tabs']");
if (!tabsComponent) return

// Options for the observer (which mutations to observe)
const config: MutationObserverInit = { attributes: true, subtree: true, attributeFilter: ['class'] };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "attributes") {
        console.log(mutation)
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(tabsComponent, config);

// Later, you can stop observing
observer.disconnect();

}

document.addEventListener("DOMContentLoaded", init)