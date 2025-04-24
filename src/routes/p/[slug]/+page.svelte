<script lang="ts">
  import PartButton from "$lib/partButton.svelte";
  import { parseSiteName } from "$lib/parseSiteName";

  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<section>
  <div>
    <div class="tags">
      {#each data.tags as item}
        <a href="/p/#{item}">
          <img class="tagImg" src="../ci/{item}.svg" alt={item} width="60px" />
          <p>{item}</p>
        </a>
      {/each}
    </div>
    <div>
      {#if data.parts?.length > 0}
        <h3>Components</h3>
        {#each data.parts as item}
          <PartButton name={item} inline={false} />
        {/each}
      {/if}
      {#if data.connecting?.length > 0}
        <h3>Connecting</h3>
        {#each data.connecting as item}
          <PartButton name={item} inline={false} />
        {/each}
      {/if}
    </div>
  </div>
  <div>
    <div>
      <h1>{data.title}</h1>
    </div>
    <p>
      <!-- sections of text surrounded by ** get turned into links -->
      {#each data.desc_short.split("*") as chunk, i}
        {#if i % 2}
          <PartButton name={chunk} />
        {:else}
          {@html chunk}
        {/if}
      {/each}
    </p>
  </div>
</section>

<section class="content">
  <h2>How’s it work?</h2>
  <article>
    <div>
      <p>
        {#each data.desc_long.split("*") as chunk, i}
          {#if i % 2}
            <PartButton name={chunk} />
          {:else}
            {@html chunk}
          {/if}
        {/each}
      </p>
    </div>
    {#if data.res}
      <div>
        {#each data.res as d, i}
          {#if d.startsWith("http")}
            <a href={d}>{parseSiteName(d)}</a>
          {:else}
            <div>
              {@html d}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </article>
</section>

<style lang="scss">
  @use "/src/lib/styles/part.scss";
  @use "/src/lib/styles/article.scss";
</style>
