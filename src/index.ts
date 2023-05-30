import gsap from "gsap";

interface Window {
  Webflow: any;
  _wq: any;
}

type ProgressDirection = "horizontal" | "vertical";

enum selectors {
  COMPONENT = '[wb-autotabs="component"]',
  PANE = ".w-tab-pane",
  LINK = ".w-tab-link",
  CURRENT_CLASS = "w--current",
  TAB_BODY = ".tab-body--pillars",
  PROGRESS_BAR = '[wb-autotabs="progress"]',
  PROGRESS_DIRECTION = "wb-autotabs-progress-direction",
}

window.Webflow ||= [];

window.Webflow.push(() => {
  const components = document.querySelectorAll<HTMLDivElement>(selectors.COMPONENT);

  if (components.length === 0) {
    console.error("No autotabs components found!");
  }

  // Loop through each component -> we want to grab the individual component
  // and it's index so we know what is changing and which one is changing
  components.forEach((component, index) => {
    // Grab the links, videos, and Progress Bars and store them in an array NOT a NodeList (what would happen if you use .querySelectorAll)
    const links = Array.from(component.querySelectorAll<HTMLAnchorElement>(selectors.LINK));
    const videos = component.querySelectorAll<HTMLVideoElement>("video");
    const progressBars = Array.from(component.querySelectorAll<HTMLDivElement>(selectors.PROGRESS_BAR));

    // Let's get the current index
    let currentIndex = links.findIndex((link) => link.classList.contains(selectors.CURRENT_CLASS));
    let requestId;

    // Setup the sections
    videos.forEach((video) => {
        video.removeAttribute('loop')
        video.removeAttribute('autoplay')
    })

    links.forEach((link) => {
        const bodyText: HTMLDivElement | null = link.querySelector(selectors.TAB_BODY);
        if (!bodyText) return

        if (!link.classList.contains('w--current')) {
            bodyText.style.display = 'none';
        } else {
            bodyText.style.display = 'block';
        }
    })

    async function playNextVideo(index: number = currentIndex) {
        // set playhead back to zero
        videos.forEach((video) => {
            video.currentTime - 0;
            video.pause()
        })

      // Wait 1 milli second to make sure videos are paused
        await new Promise((resolve) => setTimeout(resolve, 100));

        currentIndex = index;
        let currentVideo: HTMLVideoElement = videos[currentIndex % videos.length] as HTMLVideoElement;
        await currentVideo.play()
        hideTabBodyText(currentIndex)
        updateProgressBar(currentVideo, progressBars[currentIndex]);
        
        // On end
        currentVideo.onended = () => {
            currentIndex = (currentIndex + 1) % videos.length
            simulateClick(links[currentIndex]);
            playNextVideo(currentIndex)
        }
    }

    function hideTabBodyText(currentIndex: number) {
        const tabs: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.w-tab-link')

        tabs.forEach((tab: HTMLAnchorElement ) => {
            const bodyText: HTMLDivElement | null = tab.querySelector(selectors.TAB_BODY);
            if (!bodyText) return
            console.log(currentIndex, tab)
            if (!tab.classList.contains(selectors.CURRENT_CLASS)) {
                console.log(bodyText)
                bodyText.style.display = 'none';
            } else {
                bodyText.style.display = 'block'
            }
        })
    }

    function updateProgressBar(video: HTMLVideoElement, progressBar: HTMLDivElement) {
        let progressDirection: string =
        progressBar.getAttribute(selectors.PROGRESS_DIRECTION) || 'horizontal';

      if (progressDirection !== 'horizontal' && progressDirection !== 'vertical') {
        console.error('invalid progress direction');
        return;
      }

      if (requestId) {
        cancelAnimationFrame(requestId);
        resetProgressBars(progressBars);
      }

      let start: number;
      function step(timestamp: number) {
        if (!start) start = timestamp;

        let progress = (timestamp - start) / (video.duration * 1000); // duration is in seconds, timestamp in milliseconds
        progress = Math.min(progress, 1); // Cap progress at 1 (100%)

        if (progressDirection === 'horizontal') {
          progressBar.style.transform = `scaleX(${progress})`;
        } else {
          progressBar.style.transform = `scaleY(${progress})`;
        }

        if (progress < 1) {
          requestId = requestAnimationFrame(step); // Save the request ID
        }
      }

      requestId = requestAnimationFrame(step); // Save the request ID
    }

    function resetProgressBars(progressBars: HTMLDivElement[]) {
        progressBars.forEach((progressBar) => {
            let progressDirection: string =
              progressBar.getAttribute(selectors.PROGRESS_DIRECTION) || 'horizontal';
    
            if (progressDirection !== 'horizontal' && progressDirection !== 'vertical') {
              console.error('invalid progress direction');
              return;
            }
            if (progressDirection === 'horizontal') {
              progressBar.style.transform = 'scaleX(0)';
            } else {
              progressBar.style.transform = 'scaleY(0)';
            }
          });
    }

    links.forEach((link, index) => {
        link.addEventListener('click', () => playNextVideo(index))
    })

    playNextVideo();
  });
});

// need to simulate click to trigger tab change
// using click() causes scroll issues in Safari
function simulateClick(element: HTMLAnchorElement) {
  let clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  element.dispatchEvent(clickEvent);
}