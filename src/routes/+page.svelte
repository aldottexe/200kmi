<script>
  import DropDown from "$lib/dropDown.svelte";
  import InfiniteScroller from "$lib/infiniteScroller.svelte";
  import Selector from "$lib/selector.svelte";
</script>

<div class="center-div">
  <p class="callout">
    <em class="c-green">200,000 Miles</em> is the distance most modern cars can
    travel with proper maintenance. The goal of this website is to keep you
    driving to <em class="c-blue">200KMi</em> and beyond.
  </p>
</div>
<div class="welcome">
  <div>
    <h1 class="h1exactSize">About</h1>
  </div>
  <p>
    Taking care of your car should not be a skill limited to gearheads. 200KMi
    is a site deticated to helping everyone form better relationships with their
    cars. Learning basic automotive literacy can help drivers save money, drive
    farther, and keep our roads safer.
  </p>
</div>
<InfiniteScroller>
  <h3 style="margin-bottom: 0; margin-top: 7px; line-height: .9">Resources</h3>
</InfiniteScroller>
<!-- <div class="content m10p"> -->
<!--   <DropDown title="Common Maintenance" color="c-green" href="maintenance"> -->
<!--     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod -->
<!--     tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, -->
<!--     quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo -->
<!--     consequat. -->
<!--   </DropDown> -->
<!--   <DropDown title="Parts Library" color="c-orange" href="p"> -->
<!--     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod -->
<!--     tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, -->
<!--     quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo -->
<!--     consequat. -->
<!--   </DropDown> -->
<!--   <DropDown title="Core Systems" color="c-red" href="p/piston"> -->
<!--     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod -->
<!--     tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, -->
<!--     quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo -->
<!--     consequat. -->
<!--   </DropDown> -->
<!-- </div> -->
<Selector
  titles={["Maintenance", "Parts", "Core Systems"]}
  descs={[
    "Maintenance is vital for keeping your car in safe, functional condition. Though it may sound intimidating, many tasks only take a few minutes, and are relatively cheap. Keeping your car in good condiditon can even save you from costly repair bills down the road. 200kmi offers a bunch of beginner friendly tutorials.",
    "Explore detailed descriptions of car parts, this can be useful for understanding a mechanics diagnosis, understanding how cars do what they do, or even just feeding curiousity.",
    "Want to learn more about how a car works? Some basic understanding can help you build some sympathy for all of the parts spinning, griding, and combusting beneath your hood.",
  ]}
  hrefs={["maintenance", "p", ""]}
/>

<style lang="scss">
  @use "../lib/styles/global" as *;
  @use "../lib/styles/vars.scss" as *;

  .h1exactSize {
    @extend h1;
    position: relative;
    top: 5%;
    line-height: 1;
  }

  .welcome {
    @include columns(33vw);
    padding: 40px 20px !important;
    h1 {
      margin-bottom: 10px;
    }
  }
  .content {
    padding: 20px;
  }
</style>
