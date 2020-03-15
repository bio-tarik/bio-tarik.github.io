<script>
  import { i18n } from "../stores/_i18n.js";
  import Home from "../components/Home.svelte";
  import Profile from "../components/Profile.svelte";
  import Skills from "../components/Skills.svelte";
  import Contact from "../components/Contact.svelte";
</script>

<style>

</style>

<svelte:head>
</svelte:head>

<Home {...$i18n`home`} />
<Profile {...$i18n`profile`} />
<Skills {...$i18n`skills`} />
<Contact {...$i18n`contact`} />
