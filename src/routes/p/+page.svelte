<script lang="ts">
  import PartButton from "$lib/partButton.svelte";
  const { data } = $props();
  const pageNames = data.pageNamesTagged;
</script>

<div class="content">
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
    border-bottom: 1px $dark solid;
    line-height: 0.9;
    padding-bottom: 0;
    padding: 0 $medPad;
  }
  .list {
    box-sizing: border-box;
    height: calc(100vh - 36px - 120px);
    overflow-y: scroll;
    pointer-events: all;
    scrollbar-width: none;
    position: relative;
  }

  section {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    pointer-events: none;
    border-bottom: 1px $dark solid;
    padding: $medPad;
    text-transform: capitalize;
    position: relative;
    &:last-child {
      border-bottom: none;
    }
    @media (max-width: 800px) {
      flex-direction: column;
    }
    * {
      pointer-events: auto;
    }
    h2 {
      position: sticky;
      height: fit-content;
    }
  }
  .content {
    padding-top: 120px;
  }
  .buttons {
    min-width: 200px;
  }
</style>
