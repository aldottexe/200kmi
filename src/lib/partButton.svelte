<script lang='ts'>
  import {partButton} from '$lib/partViewer.svelte';

  type p = {name: string, i: number | undefined, inline: boolean | undefined};
  const {name, i = undefined, inline = true} : p = $props();

  const link = `/p/${name.replaceAll(' ', '-')}`
</script>

  <a href={link} use:partButton={{part: name, i: i}} class={inline ? "" : "block"}>{name}</a>

<style lang="scss">
  @use "styles/vars" as *;
  @import "styles/global";
  .block {
    display: block;
  }
  a {
    margin-bottom: 5px;
    color: $blue;
    &:hover {
      color: $purple;
    }
  }
</style>
