<script>
  var openedMenu = false;

  function toggleMenu() {
    openedMenu = !openedMenu;
  }
</script>

<style>
  li {
    display: none;
  }

  .responsive li {
    float: none;
    display: block;
    text-align: left;
  }

  a {
    display: block;
    padding: 14px 16px;
    text-decoration: none;
    width: 100%;
  }

  @media (min-width: 801px) {
    .icon {
      display: none;
    }

    li {
      display: inline-block;
    }
  }
</style>

<a
  href="javascript:void(0);"
  class="icon font-secondary-color"
  on:click={toggleMenu}>
  Menu
</a>
<ul class="menu-items" class:responsive={openedMenu}>
  <li>
    <a class="font-secondary-color" href="#home">Home</a>
  </li>
  <li>
    <a class="font-secondary-color" href="#profile">Profile</a>
  </li>
  <li>
    <a class="font-secondary-color" href="#home">Skills</a>
  </li>
  <li>
    <a class="font-secondary-color" href="about">Contact</a>
  </li>
  <li>
    <a class="font-secondary-color" rel="prefetch" href="blog">blog</a>
  </li>
</ul>
