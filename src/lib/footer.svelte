<footer>
  <div>
    <a href="/">
      <img src="../logo.svg" alt="icon" height="100px" />
    </a>
    <p>
      200kmi has one simple goal: give non-car enthusiests the information they
      need to take care of their cars.
    </p>
  </div>
  <div>
    <h3>Resources</h3>
    <a href="/maintenance">Maintenance</a>
    <a href="/p">Parts</a>
    <a href="/s">Core Systems</a>
  </div>
</footer>

<style lang="scss">
  @use "../lib/styles/global.scss" as *;
  @use "../lib/styles/vars.scss" as *;
  footer {
    display: flex;
    padding: 50px $smallPad;
    border-top: 2px solid $dark;
    margin: $smallPad;
    gap: 100px;
    & > * {
      width: 25%;
    }
  }
  a {
    display: block;
    font-size: $pSize;
    margin-bottom: 10px;
  }
</style>
