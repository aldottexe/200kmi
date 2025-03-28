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
      <PartButton name="piston head" inline={false} />
      <PartButton name="connecting rod" inline={false} />
      <h3>Connecting</h3>
      <PartButton name="engine" inline="false" />
    </div>
  </div>
  <div>
    <div>
      <h1>Engine</h1>
    </div>
    <p>
The engine is the heart of your vehicle, converting fuel into motion. It houses pistons, valves, and other critical parts that work together to generate power and keep your car running smoothly.
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
