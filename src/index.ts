import gsap from "gsap";

const init = () => {
  const ACTIVE_TAB = "w--current";
  let activeIndex = 0;
  let timeout;
  let tween;

  // Select the node that will be observed for mutations
  const tabsComponent = document.querySelector('[wb-data="tabs"]');
  if (!tabsComponent) return;

  const tabsMenu = tabsComponent.querySelector('[wb-data="menu"]');
  if (!tabsMenu) return;

  const tabsContent = tabsComponent.querySelector('[wb-data="content"]');
  if (!tabsContent) return;

  const videos = tabsContent.querySelectorAll(".wistia_embed");
  if (!videos) return;

  const progressBars = tabsMenu.querySelectorAll(".tab-progress-bar");

  // animate progressBars
  const animateProgressBars = (duration: number) => {
    tween = gsap.fromTo(
      progressBars[activeIndex],
      {
        width: "0%",
      },
      {
        width: "100%",
        duration: duration,
        ease: "none",
      }
    );
  };

  // autoPlay function
  const autoPlayTabs = () => {
    clearTimeout(timeout);

    const activeVideo = videos[activeIndex];
    let videoDuration: number = +activeVideo.attributes[1].value;
    console.log(videoDuration);

     if (tween) {
        tween.progress(0);
        tween.kill();
     }

    if (progressBars.length > 0) {
      animateProgressBars(videoDuration );
    }

    timeout = setTimeout(() => {
      let nextIndex;
      if (activeIndex >= tabsMenu.childElementCount - 1) {
        nextIndex = 0;
      } else {
        nextIndex = activeIndex + 1;
      }
      const nextTab = tabsMenu.childNodes[nextIndex] as HTMLAnchorElement;

      nextTab.click();
    }, videoDuration * 1000);
  };
  autoPlayTabs();

  // Options for the observer (which mutations to observe)
  const config: MutationObserverInit = {
    attributes: true,
    attributeFilter: ["class"],
    subtree: true,
  };

  // Callback function to execute when mutations are observed
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "attributes") {
        const target: HTMLAnchorElement | HTMLDivElement = mutation.target;
        if (target.classList.contains(ACTIVE_TAB)) {
          activeIndex = parseInt(target.id.slice(-1), 10);
          
          // autoplay tabs
          autoPlayTabs();
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(tabsComponent, config);
};

document.addEventListener("DOMContentLoaded", init);