<script>
  export let nameLabel;
  export let emailLabel;
  export let messageLabel;
  export let sendButton;
  export let okMessage;
  export let errorMessage;

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
    req.onload = () => mailResult("okMessage");
    req.onerror = () => mailResult("errorMessage");
    req.send(data);
  };

  const mailResult = id => {
    document.querySelector(`#${id}`).classList.add("visible");
    document.querySelector("#contact-button").classList.add("hidden");
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
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-animation: autofill 0s forwards;
    animation: autofill 0s forwards;
  }

  @media (min-width: 992px) {
    .form-button {
      font-size: 1.3rem;
    }
    input::-webkit-input-placeholder,
    textarea::-webkit-input-placeholder {
      /* Chrome/Opera/Safari */
      font-size: 1.4rem;
    }

    input:-moz-placeholder,
    textarea::-webkit-input-placeholder {
      /* Firefox 18- */
      font-size: 1.4rem;
    }

    input::-moz-placeholder,
    textarea::-webkit-input-placeholder {
      /* Firefox 19+ */
      font-size: 1.4rem;
    }

    input:-ms-input-placeholder,
    textarea::-webkit-input-placeholder {
      /* IE */
      font-size: 1.4rem;
    }

    input::-ms-input-placeholder,
    textarea::-webkit-input-placeholder {
      /* IE Edge */
      font-size: 1.4rem;
    }
  }
</style>

<form id="contactform" on:submit|preventDefault={handleSubmit}>
  <!-- Prevent implicit submission of the form -->
  <button type="submit" disabled style="display: none" aria-hidden="true" />

  <p class="validationMessage hidden" id="okMessage">{okMessage}</p>
  <p class="validationMessage hidden" id="errorMessage">{errorMessage}</p>

  <input
    class="form-input border-main-color"
    type="text"
    name="name"
    placeholder={nameLabel}
    required
    aria-label={nameLabel} />
  <input
    type="email"
    class="form-input border-main-color"
    name="email"
    placeholder={emailLabel}
    required
    aria-label={emailLabel} />
  <textarea
    name="message"
    class="form-input main-font border-main-color"
    placeholder="{messageLabel}..."
    required
    aria-label={messageLabel} />
  <input type="text" name="_gotcha" style="display:none" />

  <button
    class="form-button border-main-color font-main-color"
    id="contact-button"
    type="submit">
    {sendButton}
  </button>
</form>
