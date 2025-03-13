<script lang="ts">
  import { childNames, parentName, childButton, parentButton} from "$lib/partViewer.svelte";
</script>

<h1>Piston</h1>
<p>The piston is reponsible for transferring power from exploding gasoline, into rotational power on the driveshaft</p>

<h2>children</h2>
{#each childNames.value as name, i}
  <button use:childButton={i}>{name}</button>
{/each} 
<h2>parent</h2>
  <button use:parentButton>{parentName.value}</button>
