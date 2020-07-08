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
    color: var(--secondary-color);
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
  class="icon"
  on:click={toggleMenu}>
  ☰
</a>
<ul class="menu-items" class:responsive={openedMenu}>
  <li>
    <a href="#home">Home</a>
  </li>
  <li>
    <a href="#perfil">Profile</a>
  </li>
  <li>
    <a href="#competencias">Skills</a>
  </li>
  <li>
    <a href="#contato">Contact</a>
  </li>
  <li class="language">
    <Lang />
  </li>
</ul>
