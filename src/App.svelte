<script>
  import { i18n } from "./stores/_i18n.js";
  import Contact from "./components/Contact.svelte";
  import Home from "./components/Home.svelte";
  import Nav from "./components/Nav/Nav.svelte";
  import OutlineDisabler from "./components/OutlineDisabler.svelte";
  import Profile from "./components/Profile.svelte";
  import Skills from "./components/Skills.svelte";
</script>

<style>
  /* Global styles should be added on ../public/global.css */
</style>

<main>
  <OutlineDisabler />
  <Nav />
  <Home {...$i18n`home`} />
  <Profile {...$i18n`profile`} />
  <Skills {...$i18n`skills`} />
  <Contact {...$i18n`contact`} />
</main>
