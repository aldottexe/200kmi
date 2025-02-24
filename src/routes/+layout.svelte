<script lang="ts">
  import { init } from "$lib/partViewer.svelte";
   import {type Snippet} from 'svelte';
   let { children } :  {children: Snippet} = $props();
</script>

  <canvas use:init></canvas>

  <em>alex's garage</em>

{@render children()}

<style>
  :global {
  html {
    background-color: #fee;
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
  }
</style>
