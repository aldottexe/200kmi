<footer>
  <div class="desc">
    <a href="/">
      <img src="../logo.svg" alt="icon" height="80px" />
    </a>
    <p>Created with ♡ by <a href="alexlutz.com">Alex Lutz</a></p>
  </div>
  <div class="res">
    <h3>Resources</h3>
    <a href="/maintenance">Maintenance</a>
    <a href="/p">Parts</a>
    <a href="/s">Core Systems</a>
  </div>
  <p class="about">
    200KMi was created with a simple goal: give non-car enthusiests the
    information they need to take care of their cars.
  </p>
</footer>

<style lang="scss">
  @use "../lib/styles/global.scss" as *;
  @use "../lib/styles/vars.scss" as *;

  @mixin pad($sides) {
    padding: $smallPad;
    @each $side in $sides {
      padding-#{$side}: $medPad;
    }
  }

  footer {
    display: flex;
    border-top: 1px solid $dark;
    & > * {
      box-sizing: border-box;
      width: 33%;
      min-width: min-content;
      border-right: 1px solid $dark;
      &:last-child {
        border-right: none;
      }
    }
    @media (max-width: 750px) {
      flex-direction: column;
      & > * {
        width: 100%;
        border-right: 0;
      }
    }
  }
  a {
    display: block;
    font-size: $pSize;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 0;
  }
  .desc {
    p a {
      display: inline;
    }
    & > * {
      @include pad(bottom left right);
      &:first-child {
        @include pad(top left);
        border-bottom: 1px solid $dark;
      }
    }
  }
  .res {
    @include pad(top bottom left right);
  }
  .about {
    padding: $medPad;
  }
</style>
