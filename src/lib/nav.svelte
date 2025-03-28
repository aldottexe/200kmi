<nav>
  <div class="icon">
    <a href="/">200kmi</a>
  </div>
  <div class="center">
    <a href="/p/piston">Common Maintinance</a>
    <a href="/p/engine">Parts Library</a>
    <a href="">Core Sytems</a>
    <input class="search" type="text" placeholder="Search Parts" />
  </div>
</nav>

<style lang="scss">
  @use "styles/vars" as *;
  @import "styles/global";

  $height: 35px;

  nav {
    position: fixed;
    top: 20px;
    z-index: 5;
    & > * {
      height: $height;
      box-sizing: border-box;
    }
  }
  .icon {
    position: absolute;
    display: grid;
    align-content: center;
    z-index: 3;
  }
  .center {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100vw;
    & > * {
      /* border-color: color-mix(in srgb, $dark, $light 70%); */
      height: 100%;
      vertical-align: center;
      border-color: $dark;
      background: $light;
      height: $height;
      padding: 0 30px;
      display: inline-flex;
      align-items: center;

      &:first-child {
        border-radius: 15px 0 0 15px;
      }
    }
    a{
      $colors: $green, $orange, $red;
      @for $i from 1 through length($colors) {
        &:nth-child(#{$i}):hover {
          background: nth($colors, $i);
        }
      }

    }
  }
  .search {
    border-radius: 0 10px 10px 0;
    background-color: $purple;
    color: $light;
  }
  a,
  input {
    font-size: 13px;
    line-height: 20px;
    padding: 0;
    border: none;
    outline: none;
    &::placeholder {
      color: $light;
      opacity: 50%;
    }
  }
  a {
    color: $dark;
  }
</style>
