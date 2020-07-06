<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  export let sectionId;
  export let heading;
  export let paragraph;
  let show = false;

  onMount(() => { show = true; })
</script>

<style>
  .home {
    text-align: right;
    justify-content: flex-end;
  }

  h1 {
    font-size: 10rem;
    line-height: 90%;
    font-weight: lighter;
  }

  p,
  span {
    margin: 0 5% 5% 0;
  }
</style>

<section id={sectionId} class="{sectionId} bg-main-color font-secondary-color">
  {#if show}
    <div class="home" transition:fade>
      <div>
        <span>
          {#each heading as text}
            <h1 class="name mainColor">{text}</h1>
          {/each}
        </span>
        <p id="title" class="">{paragraph}</p>
      </div>
    </div>
  {/if}
</section>
