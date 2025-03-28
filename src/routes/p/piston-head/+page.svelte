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
      <PartButton name="connecting rod" inline={false} />
      <PartButton name="piston" inline={false} />
    </div>
  </div>
  <div>
    <div>
      <h1>Piston Head</h1>
    </div>
    <p>
The piston head is the top surface of the piston, exposed to extreme heat and pressure. It helps seal the combustion chamber and plays a key role in efficient fuel burning and power generation.
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
