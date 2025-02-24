<script lang="ts">
  import { init } from "$lib/partViewer.svelte";
   import {type Snippet} from 'svelte';
   let { children } :  {children: Snippet} = $props();
</script>

  <canvas use:init></canvas>

<h1>
  hello!
</h1>

{@render children()}

<style>
  :global {
  html {
    background-color: #fee;
  }
  }

  canvas {
    position: fixed;
    z-index: -1;
    width: 100vw;
    height: 100vh;
  }
</style>
