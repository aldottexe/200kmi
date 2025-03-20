<script lang='ts'>
  import {partButton} from '$lib/partViewer.svelte';


  type p = {name: string, i: number | undefined};


  const {name, i} : p = $props();

  const link = `/p/${name.replaceAll(' ', '-')}`
</script>
  <a href={link} use:partButton={{part: name, i: i}}>{name}</a>
