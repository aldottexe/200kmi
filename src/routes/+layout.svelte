<script lang="ts">
  import { init } from "$lib/partViewer.svelte";
  import { selectPart, queryPart } from "$lib/partViewer.svelte";
  import { type Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  import { page } from "$app/state";

  const r = $derived(page.route.id?.split("/").pop());
  $effect(() => {
    (async () => {
      const p = await queryPart(r || "not-found");
      await selectPart(p);
    })();
  });
</script>

<canvas use:init></canvas>

<em>200kmi</em>

<div class="part">
  {@render children()}
</div>

<style>
  :global {
    html {
      background-color: #eaeaea;
    }
    body {
      margin: 0;
      padding: 0;
    }
  }

  canvas {
    position: fixed;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    pointer-events: all;
    image-rendering: pixelated;
    /* filter: blur(1px); */
  }

  :global .part {
    margin-left: 40px;

    * {
      font-family: helvetica;
      width: fit-content;
    }

    h1 {
      font-size: 120px;
      text-transform: uppercase;
      letter-spacing: -5px;
      margin-bottom: 20px;
    }
    p {
      margin-left: 10px;
      width: 400px;
      line-height: 25px;
    }
  }
  .part {
    width: fit-content;
  }
</style>
