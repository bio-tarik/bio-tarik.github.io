<script>
  import Lang from "./Lang.svelte";

  var openedMenu = false;

  function toggleMenu() {
    openedMenu = !openedMenu;
  }
</script>

<style>
  li {
    display: none;
    padding: 5px 10px;
  }

  .responsive li {
    float: none;
    display: block;
  }

  .icon {
    font-size: 4rem;
    padding: 0px 10px;
  }

  a {
    text-decoration: none;
  }

  @media (min-width: 801px) {
    .icon {
      display: none;
    }

    li {
      display: inline-block;
    }

    .language {
      float: right;
    }
  }
</style>

<a
  href="javascript:void(0);"
  class="icon font-secondary-color"
  on:click={toggleMenu}>
  ☰
</a>
<ul class="menu-items" class:responsive={openedMenu}>
  <li>
    <a class="font-secondary-color" href="#home">Home</a>
  </li>
  <li>
    <a class="font-secondary-color" href="#perfil">Profile</a>
  </li>
  <li>
    <a class="font-secondary-color" href="#competencias">Skills</a>
  </li>
  <li>
    <a class="font-secondary-color" href="#contato">Contact</a>
  </li>
  <li>
    <a class="font-secondary-color" rel="prefetch" href="Blog">Blog</a>
  </li>
  <li class="language">
    <Lang />
  </li>
</ul>
