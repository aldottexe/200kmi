<script lang="ts">
  import { init } from "$lib/partViewer.svelte";
  import { navigate } from "$lib/partViewer.svelte";
  import { page } from "$app/state";
  import Nav from "$lib/nav.svelte";
  import type { LayoutProps } from "./$types";

  let { children, data }: LayoutProps = $props();

  // @ts-expect-error
  $effect(async () => {
    navigate(page.url.pathname);
  });
</script>

<svelte:window />
<canvas use:init></canvas>

<Nav pageNames={data.pageNames} />

<div class="part">
  {@render children()}
</div>

<style lang="scss">
  @import "../lib/styles/global";
  :global {
    body {
      padding: 0;
      margin: 0;
    }
  }

  canvas {
    position: fixed;
    z-index: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: auto;
    filter: blur(0.5px);
    opacity: 80%;
  }
</style>
