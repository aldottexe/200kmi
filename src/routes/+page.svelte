<script>
  import DropDown from "$lib/dropDown.svelte";
</script>

<div class="center-div">
  <p class="callout">
    <em class="c-green">200,000 Miles</em> is the distance most modern cars can
    travel with proper maintenance. The goal of this website is to keep you
    driving  to <em class="c-blue">200KMi</em> and beyond.
  </p>
</div>
<div class="content m10p">
  <div class="welcome">
    <h1>About</h1>
    <p>
      Taking care of your car should not be a skill limited to carheads. 200kmi
      is a site deticated to helping everyone form better relationships with
      their cars. Learning basic automotive literacy can help drivers save
      money, drive farther, and keep our roads more safe.
    </p>
    <!-- <p> -->
    <!--   Looking to save some money? Learn some basic maintinance using our range -->
    <!--   of beginner to advanced tutorials! Unsure about your mechanic's diagnosis? -->
    <!--   Search our Library of parts to learn what needs to be replacing and why! -->
    <!--   Just think cars are cool and what to learn more? Learn about how you car -->
    <!--   works by viewing its basic systems. -->
    <!-- </p> -->
  </div>

  <h1>Resources</h1>
  <DropDown title="Common Maintenance" color="c-green" href="maintenance">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </DropDown>
  <DropDown title="Parts Library" color="c-orange" href="p">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </DropDown>
  <DropDown title="Core Systems" color="c-red" href="p/piston">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat.
  </DropDown>
</div>

<style lang="scss">
  @use "../lib/styles/global";
  @use "../lib/styles/vars.scss" as *;

  @mixin columns {
    border-top: 1px $dark solid;
    padding-top: 20px;

    display: flex;
    * {
      width: 50%;
    }
    @media (max-width: 1000px) {
      flex-direction: column;
      * {
        width: unset;
      }
    }
  }

  .welcome {
    @include columns;
    margin-bottom: 100px;
    p {
      letter-spacing: 0.5px;
    }
  }
  .content {
    padding: 20px;
  }
</style>
