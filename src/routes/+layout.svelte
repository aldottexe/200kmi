<script lang="ts">
  import { init } from "$lib/partViewer.svelte";
  import { selectPart, queryPart } from "$lib/partViewer.svelte";
  import { page } from "$app/state";
  import { type Snippet } from "svelte";
  import Nav from "$lib/nav.svelte";

  let { children }: { children: Snippet } = $props();

  const r = $derived(page.route.id?.split("/").pop());

  // @ts-expect-error
  $effect(async () => {
      const p = await queryPart(r || "no-part");
      await selectPart(p);
  });
</script>

<canvas use:init></canvas>

<Nav/>

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
    image-rendering: pixelated;
    filter: blur(.5px);
    opacity: 80%;
  }
</style>
