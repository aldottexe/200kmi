<script lang="ts">
  import PartButton from "$lib/partButton.svelte";
</script>

<section>
  <div>
    <div>
      <p>combustion</p>
      <p>rotating assembly</p>
    </div>
    <div>
      <h3>Components</h3>
      <h3>Connecting</h3>
      <PartButton name="piston head" inline={false} />
      <PartButton name="piston" inline={false} />
    </div>
  </div>
  <div>
    <div>
      <h1>Connecting Rod</h1>
    </div>
    <p>
The connecting rod links the piston to the crankshaft, converting the piston’s up-and-down motion into rotational force. A strong, well-functioning rod ensures smooth engine operation and power delivery.
    </p>
  </div>
</section>

<section>
  <h2>About</h2>
  <p>
    The piston turns the force of exploding gas and air into kinetic energy that
    can be used by the <PartButton name="engine" />
  </p>
</section>

<style>
  @import "/src/lib/styles/part.scss";
</style>
