<script>

    import DropDown from "$lib/dropDown.svelte";

</script>
<div class="m10p">
  <div class="center-div">
    <p class="callout">
      <em class="c-green">200,000 Miles</em> is the distance most modern cars
      can travel with proper maintenance. The goal of this website is to keep
      you driving  to <em class="c-blue">200KMi</em> and beyond.
    </p>
  </div>

  <h1>Resources</h1>
  <DropDown title="Common Maintenance" color="c-green" href="p/piston">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </DropDown>
  <DropDown title="Parts Library" color="c-orange" href="p/piston">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </DropDown>
  <DropDown title="Core Systems" color="c-red" href="p/piston">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </DropDown>
</div>
<style lang="scss">
  @import "../lib/styles/global"
</style>
