<script lang="ts">
  import { partButton } from "$lib/partViewer.svelte";

  type p = { name: string; i: number | undefined; inline: boolean | undefined };
  const { name, i = undefined, inline = true }: p = $props();

  let link = $derived(`/p/${name.replaceAll(" ", "-")}`);
</script>

{#key name}
  <a
    href={link}
    use:partButton={{ part: name, i: i }}
    class={inline ? "" : "block"}>{name}</a
  >
{/key}

<style lang="scss">
  @use "styles/vars" as *;
  @use "styles/global";
  .block {
    display: block;
  }
  a {
    margin-bottom: 5px;
    color: $blue;
    font-size: $pSize;
    &:hover {
      color: $purple;
    }
  }
</style>
