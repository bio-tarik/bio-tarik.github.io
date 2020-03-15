<script>
  export let sectionId;
  export let heading;
  export let paragraph;
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

<section class="{sectionId} bg-main-color font-secondary-color">
  <div class="home">
    <span>
      {#each heading as text}
        <h1 class="name fadeIn animated mainColor">{text}</h1>
      {/each}
    </span>
    <p id="title" class="fadeIn animated">{paragraph}</p>
  </div>
</section>
