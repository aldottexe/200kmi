<script lang="ts">
  import PartButton from "$lib/partButton.svelte";
  const { data } = $props();
  const pageNames = data.pageNamesTagged;
</script>

<div class="m10p">
  <h1>Parts</h1>
  <div class="list">
    {#each pageNames.entries() as tag}
      <section id={tag[0]}>
        <div class="categoryTitle">
          <img src="../ci/{tag[0]}.svg" alt={tag[0]} />
          <h2>{tag[0]}</h2>
        </div>
        <div class="buttons">
          {#each Array.from(tag[1]).sort() as name}
            <PartButton {name} inline={false}></PartButton>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>

<style lang="scss">
  @use "../../lib/styles/global" as *;
  @use "../../lib/styles/vars.scss" as *;
  .categoryTitle {
    display: flex;
    gap: 10px;
    align-items: center;
    height: fit-content;
    img {
      height: 60px;
      position: relative;
      transform: translateY(-6px);
    }
  }
  hr {
    border: 1px $dark solid;
  }
  h1 {
    @extend h3;
    border-bottom: 2px $dark solid;
    line-height: 0.9;
    padding-bottom: 0;
    padding-left: 5px;
  }

  section {
    margin: 40px 0;
    position: relative;
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    pointer-events: none;
    * {
      pointer-events: auto;
    }
    h2 {
      text-transform: capitalize;
      position: sticky;
      top: 100px;
      z-index: 4;
      height: fit-content;
    }
  }
  .m10p {
    padding-top: 120px;
  }
  .buttons {
    min-width: 200px;
  }
</style>
