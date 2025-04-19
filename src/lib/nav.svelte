<script lang="ts">
  import { fade } from "svelte/transition";

  const { pageNames } = $props();

  function fuzzyFind(item: string, list: Array<string>): Array<string> {
    const starts: Array<string> = [];
    const includes: Array<string> = [];
    list.forEach((e) => {
      if (e.startsWith(item)) return starts.push(e);
      if (e.includes(item)) return includes.push(e);
    });
    starts.sort((a, b) => (a.length > b.length ? 1 : -1));

    return starts.concat(includes);
  }

  function buttonNav(e: KeyboardEvent) {
    console.log(e.key);
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (suggestionSelected > 0) suggestionSelected--;
        return;
      case "ArrowDown":
        e.preventDefault();
        if (suggestionSelected < namesSorted.length - 1) suggestionSelected++;
        return;
      case "Enter":
        e.preventDefault();
        document.querySelector(".selected").click();
        searchValue = "";
      default:
        suggestionSelected = 0;
    }
  }

  let suggestionSelected = $state(-1);
  let suggestionHovered = $state(false);
  let showSuggestions = $state(false);
  let searchValue = $state("");
  let namesSorted = $derived(
    fuzzyFind(searchValue.replaceAll(" ", "-"), pageNames),
  );
</script>

<nav>
  <div class="icon">
    <a href="/">
      <img src="../logo.svg" alt="" width="70px" />
    </a>
  </div>
  <!-- nav bar -->
  <div class="center-bar">
    <div class="center-buttons">
      <a href="/maintenance">Maintinance</a>
      <a href="/p">Parts</a>
      <a href="">Core Sytems</a>
      <input
        class="search"
        type="text"
        placeholder="Search Parts"
        bind:value={searchValue}
        bind:focused={showSuggestions}
        onkeydown={buttonNav}
      />
    </div>

    <!-- suggestions -->
    {#if (showSuggestions || suggestionHovered) && namesSorted.length > 0}
      <div class="suggestions">
        {#each namesSorted as name, i}
          <a
            class={suggestionSelected === i ? "selected" : ""}
            href="/p/{name}"
            transition:fade|global={{ duration: 50 }}
            onmouseenter={() => {
              suggestionSelected = i;
              suggestionHovered = true;
            }}
            onmouseleave={() => {
              suggestionSelected = -1;
              suggestionHovered = false;
            }}
          >
            {name.replaceAll("-", " ")}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</nav>

<style lang="scss">
  @use "styles/vars" as *;
  @import "styles/global";

  $height: 35px;

  nav {
    position: fixed;
    left: 0;
    width: 100vw;
    top: 20px;
    z-index: 5;
    & > * {
      height: $height;
      box-sizing: border-box;
    }
    * {
      transition: background-color 0.1s;
    }
  }
  .icon {
    position: absolute;
    display: grid;
    align-content: center;
    z-index: 3;
    padding-left: $smallPad;
    padding-top: 5px;
  }
  .center-bar {
    width: fit-content;
    margin: 0 auto;
  }
  .center-buttons {
    display: flex;
    justify-content: center;
    background: $light2;
    border-radius: 15px;
    & > * {
      height: 100%;
      vertical-align: center;
      border-color: $dark;
      height: $height;
      padding: 0 30px;
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
    }
    a {
      border: 5px $light2 solid;
      border-radius: 15px;
      $colors: $green, $orange, $red;
      @for $i from 1 through length($colors) {
        &:nth-child(#{$i}):hover {
          background: nth($colors, $i);
          color: $light2;
        }
      }
    }
  }
  .search {
    border-radius: 0 15px 15px 0;
    background-color: color-mix(in srgb, $light2, #fff 10%);
    color: $dark;
    &:focus {
      background-color: color-mix(in srgb, $purple, $light2 50%);
    }
  }
  .suggestions {
    width: 100%;
    background: $light2;
    box-sizing: border-box;
    padding: 5px;
    margin-top: 10px;
    border-radius: 15px;

    a {
      display: block;
      border-radius: 10px;
      padding: 10px;
    }
    .selected {
      background: $blue;
      color: $light;
    }
  }
  a,
  input {
    font-size: 13px;
    line-height: 20px;
    padding: 0;
    padding: 10px;
    border: none;
    outline: none;
    &::placeholder {
      color: $dark;
      opacity: 50%;
    }
  }
  a {
    color: $dark;
  }
</style>
