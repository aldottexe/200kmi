<script lang="ts">
  import PartButton from "$lib/partButton.svelte";
  const { data } = $props();
  const articleNames = data.articles;
</script>

<div class="m10p">
  <h1>Maintinance Articles</h1>
  <ul>
    {#each articleNames as article}
      <a href="maintenance/{article.id}">{article.title}</a>
    {/each}
  </ul>
</div>

<style lang="scss">
  @use "$lib/styles/global.scss" as *;
  @use "$lib/styles/vars.scss" as *;
  a {
    margin-bottom: 10px;
    color: $blue;
    display: block;
    &:hover {
      color: $purple;
    }
  }
  h1 {
    @extend h3;
    margin-bottom: 2px $dark solid;
    border-bottom: 2px $dark solid;
    line-height: 0.9;
    padding-bottom: 0;
    padding-left: 5px;
  }
  .m10p {
    padding-top: 120px;
  }
</style>
