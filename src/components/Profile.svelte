<script>
  export let sectionId;
  export let heading;
  export let paragraph;
  import SectionTitle from "../components/SectionTitle.svelte";
</script>

<style>
  .perfil {
    line-height: 160%;
  }
  p {
    font-size: 1.6rem;
    padding: 0% 5% 10% 10%;
  }

  @media (min-width: 992px) {
    .perfil {
      line-height: 180%;
    }
  }
</style>

<section class="{sectionId} bg-secondary-color font-main-color perfil">
  <SectionTitle id="{sectionId}" text={heading} />
  <div class="profileText wallOfText">
    {#each paragraph as text, index}
      <p>
        {@html text}
      </p>
    {/each}
  </div>
</section>
