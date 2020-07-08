<script>
  import { switchLang, lang } from "../../stores/_i18n.js";
  import { onMount } from "svelte";

  onMount(() => {
    switchLang(navigator.language.split("-")[0]);
  });
</script>

<style>
  button {
    font-weight: lighter;
    margin: 0px 5px;
    font-size: 3rem;
    background-color: transparent;
    border: none;
    color: var(--secondary-color);
    font-family: var(--main-font);
  }

  .cursor-pointer {
    cursor: pointer;
  }
</style>

<div>
  <button
    class="cursor-pointer"
    data-cy="switch-lang-button"
    on:click={() => switchLang('pt')}>
    PT
  </button>
  <button
    class="cursor-pointer"
    data-cy="switch-lang-button"
    on:click={() => switchLang('en')}>
    EN
  </button>
  <button
    class="cursor-pointer"
    data-cy="switch-lang-button"
    on:click={() => switchLang('it')}>
    IT
  </button>
</div>
