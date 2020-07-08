<script>
  import { fade } from "svelte/transition";

  export let heading;
  export let paragraph;
  export let sectionId;
</script>

<style>
  .home {
    background-color: var(--main-color);
    color: var(--secondary-color);
    justify-content: flex-end;
    text-align: right;
  }

  h1 {
    font-size: 10rem;
    font-weight: lighter;
    line-height: 90%;
  }

  p,
  span {
    margin: 0 5% 5% 0;
  }
</style>

<section id={sectionId} class="{sectionId} bg-main-color font-secondary-color">
  <div class="home">
    <span>
      {#each heading as text, i}
        <h1 class="name mainColor" transition:fade="{{ duration: 500, delay: 500 * (i) }}">{text}</h1>
      {/each}
    </span>
    <p id="title" class="" transition:fade="{{ duration: 500, delay: 1000 }}">{paragraph}</p>
  </div>
</section>
