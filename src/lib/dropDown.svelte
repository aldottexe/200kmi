<script lang="ts">
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  type p = {
    title: string;
    color: string;
    href: string | undefined;
    children: Snippet;
  };
  const { title = "Dropdown", color = "c-blue", href, children }: p = $props();

  let open = $state(false);
</script>

<div class="drop-down">
  <button onclick={() => (open = !open)} class="header">
    <h2 class={color}>{title}</h2>
    <svg id="shape" viewBox="0 0 72 72" style:rotate={open ? "0deg" : "-45deg"}>
      <line class={color} x1="3.6" y1="3.6" x2="68.4" y2="68.4" />
      <line class={color} x1="68.4" y1="3.6" x2="3.6" y2="68.4" />
    </svg>
  </button>
  {#if open}
    <div class="content" transition:slide={{ duration: 200 }}>
      <p>
        {@render children()}
      </p>
      {#if href}<a {href} class={color}>Explore</a>{/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "styles/vars" as *;
  @import "styles/global";

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 100px;
    width: 100%;
  }
  button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font-size: 100px;
    height: fit-content;
    width: fit-content;
    font-size: unset;

    svg {
      width: 60px;
      height: 60px;
      transition: rotate 0.2s ease-in-out;
      stroke-width: 2px;
    }
  }
  .content {
    margin-bottom: 60px;
    position: relative;
    z-index: 2;
  }
  h2 {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 7px;
    text-align: left;
  }
  p {
    max-width: 600px;
  }
  a {
    font-family: EditorialNew;
    font-size: 30px;
    font-weight: 400;
    font-style: italic;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 1.5px;
    }
  }
  .drop-down {
    max-width: 75%;
    margin-bottom: 30px;
  }
</style>
