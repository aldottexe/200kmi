<script lang="ts">
  const { children } = $props();
  function scroller(node: HTMLElement) {
    const child = node.children[0].children[0];
    resize();

    let shouldResize = false;
    child.addEventListener("animationiteration", () => {
      if (shouldResize) resize();
    });

    window.addEventListener("resize", () => {
      shouldResize = true;
    });

    function resize() {
      node.children[0].classList.remove("active");

      while (node.scrollWidth <= node.clientWidth) {
        node.children[0].appendChild(child.cloneNode(true));
      }
      node.children[0].appendChild(child.cloneNode(true));

      node.children[0].classList.add("active");
    }
  }
</script>

<div class="scrollHolder" use:scroller>
  <div class="scrollContent active">
    <div class="scrollItem">
      {@render children()}
    </div>
  </div>
</div>

<style lang="scss">
  @use "styles/vars" as *;
  $gap: 10px;

  .scrollHolder {
    padding: 10px;
    border: {
      bottom: 1px $dark solid;
      top: 1px $dark solid;
    }
    overflow-x: hidden;
  }
  .scrollContent {
    display: flex;
    position: relative;
    gap: $gap;
  }
  @keyframes scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-1 * (100% + $gap)));
    }
  }
  .active * {
    animation: scroll 5s infinite linear;
  }
</style>
