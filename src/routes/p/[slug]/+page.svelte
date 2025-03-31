<script lang="ts">
  import PartButton from "$lib/partButton.svelte";

  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<section>
  <div>
    <div>
      {#each data.tags as item}
        <p>{item}</p>
      {/each}
    </div>
    <div>
      <h3>Components</h3>
      {#each data.parts as item}
        <PartButton name={item} inline={false} />
      {/each}
      <h3>Connecting</h3>
      {#each data.connecting as item}
        <PartButton name={item} inline={false} />
      {/each}
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
          {chunk}
        {/if}
      {/each}
    </p>
  </div>
</section>

<section>
  <h2>How’s it work</h2>
  <p>
    {#each data.desc_long.split("*") as chunk, i}
      {#if i % 2}
        <PartButton name={chunk} />
      {:else}
        {chunk}
      {/if}
    {/each}
  </p>
</section>

<style>
  @import "/src/lib/styles/part.scss";
</style>
