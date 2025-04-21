<script lang="ts">
  import PartButton from "$lib/partButton.svelte";
  const { data } = $props();
  const articleNames = data.articles;
</script>

<div>
  <h1>Maintinance Articles</h1>
  <ul>
    {#each articleNames as article}
      <li>
        <a href="maintenance/{article.id}">{article.title}</a>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  @use "$lib/styles/global.scss" as *;
  @use "$lib/styles/vars.scss" as *;
  a {
    margin-bottom: 10px;
    display: block;
    font-size: $pSize;
  }
  h1 {
    @extend h3;
    margin-bottom: 1px $dark solid;
    border-bottom: 1px $dark solid;
    line-height: 0.9;
    padding-bottom: 0;
    padding-left: $medPad;
  }
  div {
    padding: 120px 0 0;
  }
  ul {
    padding: $smallPad;
    padding-left: $medPad;
  }
  li {
    list-style-type: none;
  }
</style>
