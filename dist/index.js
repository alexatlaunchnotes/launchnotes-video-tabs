(()=>{var c=()=>{console.log("loaded");let t=document.querySelector("[wb-data='tabs']");if(!t)return;let n={attributes:!0,subtree:!0,attributeFilter:["class"]},r=(s,a)=>{for(let o of s)o.type==="attributes"&&console.log(o)},e=new MutationObserver(r);e.observe(t,n),e.disconnect()};document.addEventListener("DOMContentLoaded",c);})();
//# sourceMappingURL=index.js.map
