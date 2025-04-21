<script lang="ts">
  import { fade } from "svelte/transition";
  type p = {
    titles: Array<string>;
    descs: Array<string>;
    hrefs: Array<string>;
  };
  const { titles, descs, hrefs }: p = $props();
  let selected = $state(0);
</script>

<section>
  <div>
    {#each titles as title, i}
      <button
        class={selected === i ? "selected" : ""}
        onclick={() => (selected = i)}
      >
        {title}
      </button>
    {/each}
  </div>
  {#key selected}
    <div class="desc">
      <p>
        {descs[selected]}
      </p>
      <a href={hrefs[selected]}>Explore {titles[selected]}</a>
    </div>
  {/key}
</section>

<style lang="scss">
  @use "styles/global.scss" as *;
  @use "styles/vars.scss" as *;
  button {
    @extend h2;
    background: none;
    border: none;
    display: block;
    border-right: 1px solid $dark;
    border-bottom: 1px solid $dark;
    width: 100%;
    text-align: left;
    padding: $smallPad;
    transition: all 0.2s;
    &:last-child {
      border-bottom: none;
      padding-bottom: calc(8 * $smallPad);
    }
  }
  section {
    display: flex;
    width: 100%;
    & > * {
      width: 50%;
    }
  }
  .desc {
    padding: $medPad;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .selected {
    border-right: 5px $green solid;
    color: $green;
    text-decoration: none;
    text-underline-offset: 4px;
    text-decoration-thickness: 1.5px;
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
</style>
