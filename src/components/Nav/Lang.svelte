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
    margin: 5px;
    font-size: 3rem;
    background-color: transparent;
    border: none;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  li {
    display: inline;
  }
</style>

<ul>
  <li>
    <button
      class="font-secondary-color cursor-pointer main-font"
      data-cy="switch-lang-button"
      on:click={() => switchLang('pt')}>
      PT
    </button>
  </li>
  <li>
    <button
      class="font-secondary-color cursor-pointer main-font"
      data-cy="switch-lang-button"
      on:click={() => switchLang('en')}>
      EN
    </button>
  </li>
  <li>
    <button
      class="font-secondary-color cursor-pointer main-font"
      data-cy="switch-lang-button"
      on:click={() => switchLang('it')}>
      IT
    </button>
  </li>
</ul>
