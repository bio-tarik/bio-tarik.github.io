<script>
  import Menu from "./Menu.svelte";
</script>

<style>
  nav {
    background-color: var(--main-color);
    position: fixed;
    overflow: hidden;
    text-align: left;
    font-size: 3rem;
    font-weight: lighter;
    width: 100%;
  }
</style>

<nav>
  <Menu />
</nav>
