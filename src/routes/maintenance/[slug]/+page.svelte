<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
  import { parseSiteName } from "$lib/parseSiteName";
</script>

<div>
  <h1>{data.title}</h1>
  <article>
    <div class="content">
      <p>{@html data.intro}</p>

      <ol>
        {#each data.steps as step}
          <li>
            <h3>{step.title}</h3>
            <p>{@html step.content}</p>
          </li>
        {/each}
      </ol>

      <p>{@html data.outro}</p>
    </div>

    <div class="res">
      <h2>Resources</h2>
      {#each data.res as i}
        {#if i.startsWith("http")}
          <a href={i}>{parseSiteName(i)}</a>
        {:else}
          <div>
            {@html i}
          </div>
        {/if}
      {/each}
    </div>
  </article>
</div>

<style lang="scss">
  @use "$lib/styles/global.scss" as *;
  @use "$lib/styles/vars.scss" as *;
  @use "$lib/styles/article.scss";

  li {
    counter-increment: list-c;
    position: relative;
    &::before {
      @extend h3;
      content: counter(list-c);
      color: $dark !important;

      display: grid;
      position: absolute;
      left: -90px;
      top: -13px;

      box-sizing: border-box;
      width: 70px;
      height: 70px;
      padding: 1% 0 0 0.2%;

      place-items: center;
      border-radius: 50px;
      border: 1px $green solid;
    }
  }
  ol {
    list-style: none;
    counter-reset: list-c;
  }
  h1 {
    line-height: 1.1;
    padding-bottom: $smallPad;
    margin-bottom: $medPad;
    padding-top: 120px;
    padding-left: $medPad;
    border-bottom: 1px $dark solid;
  }
  article {
    padding-left: $medPad;
  }
</style>
