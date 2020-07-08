<script>
  export let nameLabel;
  export let emailLabel;
  export let messageLabel;
  export let sendButton;
  export let okMessage;
  export let errorMessage;

  let hasError = false;
  let emailSent = false;

  async function handleSubmit(event) {
    if (event.target.id === "contactform") {
      sendMail(event.target);
    }
  }

  const sendMail = form => {
    var data = new FormData(form);
    var req = new XMLHttpRequest();
    req.open("POST", `https://formcarry.com/s/ZVdAIg81Lst`, true);
    req.setRequestHeader("Accept", "application/json");
    req.onload = () => (emailSent = true);
    req.onerror = () => (hasError = true);
    req.send(data);
  };
</script>

<style>
  #contactform {
    font-size: 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 5%;
  }

  #contactform * {
    width: 80%;
  }

  .validationMessage {
    font-size: 2rem;
    margin-bottom: 5px;
  }

  .form-input {
    min-height: 40px;
    margin-bottom: 5%;
    resize: none;
    background-color: transparent;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    box-shadow: none;
    border-radius: 0%;
    padding: 0;
    border-color: var(--main-color);
    font-family: var(--main-font);
  }

  .form-input:focus {
    border-color: var(--detail-color);
  }

  textarea {
    padding-bottom: 10%;
  }

  .form-button {
    padding: 20px 20px 20px 20px;
    border: 1px solid;
    background-color: transparent;
    font-size: 1.8rem;
    cursor: pointer;
    border-color: var(--main-color);
    color: var(--main-color);
  }

  input::placeholder, textarea::placeholder {
    color: var(--main-color);
    font-size: 1.8rem;
  }

  @media (min-width: 992px) {
  }
</style>

<form id="contactform" on:submit|preventDefault={handleSubmit}>
  <!-- Prevent implicit submission of the form -->
  <button type="submit" disabled style="display: none" aria-hidden="true" />

  {#if emailSent}
    <p class="validationMessage" id="okMessage">{okMessage}</p>
  {/if}

  {#if hasError}
    <p class="validationMessage" id="errorMessage">{errorMessage}</p>
  {/if}

  <input
    class="form-input"
    type="text"
    name="name"
    placeholder={nameLabel}
    required
    aria-label={nameLabel} />
  <input
    type="email"
    class="form-input"
    name="email"
    placeholder={emailLabel}
    required
    aria-label={emailLabel} />
  <textarea
    name="message"
    class="form-input"
    placeholder="{messageLabel}..."
    required
    aria-label={messageLabel} />
  <input type="text" name="_gotcha" style="display:none" />

  <button class="form-button" id="contact-button" type="submit">
    {sendButton}
  </button>
</form>
