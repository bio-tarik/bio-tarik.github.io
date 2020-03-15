import { writable } from "svelte/store";
/**
 * Dumb i18n
 *
 * How to use:
 *
 * In your component's <script> part:
 *     import { i18n } from '../stores/i18n.js';
 *
 * i18n is an ES6 template literals function.
 *
 * So in your component's HTML part:
 *    use {$i18n`key`}
 * or use {@html $i18n`key`} if your content has some markup.
 *
 * As it is a template literal, you can put placeholders in it:
 *    use {$i18n`${someVarValue}`}
 *
 * I don't know if it will be of any use, but there you have it.
 *
 **/

const langs = ["en", "pt", "it"];
const labelsByLang = {
  pt: {
    home: {
      sectionId: "home",
      heading: ["Tarik", "Ayoub"],
      paragraph: "Desenvolvedor Web Full Stack"
    },
    profile: {
      sectionId: "perfil",
      heading: "Perfil",
      paragraph: [
        "Sou um desenvolvedor web <strong>full stack</strong> com perfil <strong>autodidata</strong>, multidisciplinar e proativo.",
        "Atuo na área de TI <strong>desde 2013</strong> como analista <strong>desenvolvedor</strong>. Possuo experiência no desenvolvimento, implantação e manutenção de sistemas complexos e com tecnologias relevantes.",
        "Além das capacidades técnicas possuo vivência em projetos ágeis e experiência com trabalho remoto."
      ]
    },
    skills: {
      sectionId: "competencias",
      heading: "Competências"
    },
    contact: {
      sectionId: "contato",
      heading: "Contato",
      nameLabel: "Seu nome",
      emailLabel: "Seu email",
      messageLabel: "Escreva para mim",
      sendButton: "Enviar",
      okMessage:
        "Obrigado pelo contato! E daqui a pouco te mando uma resposta :)",
      errorMessage:
        "Oops... alguma coisa deu errado. Se possível mande um email para <span>bio.tarik</span>@<span>gmail</span><span>.com</span>"
    }
  },
  en: {
    home: {
      sectionId: "home",
      heading: ["Tarik", "Ayoub"],
      paragraph: "Full Stack Web Developer"
    },
    profile: {
      sectionId: "perfil",
      heading: "Profile",
      paragraph: [
        "I am a <strong>full stack</strong> web developer. I have been working in IT <strong>since 2013</strong> as a analyst <strong>developer</strong>.",
        "I am experienced in developing, deploying and maintaining complex and technologically relevant systems. Besides these technical competences I also have knowledge of agile methodologies and remote work.",
        "Key competencies: <strong>autodidact</strong>, proactive and a multidisciplinary background."
      ]
    },
    skills: {
      sectionId: "competencias",
      heading: "Skills"
    },
    contact: {
      sectionId: "contato",
      heading: "Contact",
      nameLabel: "Your name",
      emailLabel: "Your email",
      messageLabel: "Write me a message",
      sendButton: "Send",
      okMessage:
        "Thank you for getting in touch! I'll write you a message soon :)",
      errorMessage:
        "Oops... something went wrong. If possible email me at <span>bio.tarik</span>@<span>gmail</span><span>.com</span>"
    }
  },
  it: {
    home: {
      sectionId: "home",
      heading: ["Tarik", "Ayoub"],
      paragraph: "Sviluppatore Web Full Stack"
    },
    profile: {
      sectionId: "perfil",
      heading: "Profilo",
      paragraph: [
        "​Sono uno sviluppatore web <strong>full stack</strong> proattivo, interdisciplinare e <strong>autodidatta</strong>.",
        "Lavoro <strong>dal 2013</strong> come analista <strong>sviluppatore</strong>. Ho esperienza nello sviluppo, deployment e manutenzione dei sistemi complessi e tecnologicamente rilevanti.",
        "A parte le competenze tecniche conosco le metodologie agile e ho esperienza nel lavoro da remoto."
      ]
    },
    skills: {
      sectionId: "competencias",
      heading: "Competenze"
    },
    contact: {
      sectionId: "contato",
      heading: "Contatto",
      nameLabel: "Il tuo nome",
      emailLabel: "La tua email",
      messageLabel: "Scrivimi una mail",
      sendButton: "Invio",
      okMessage: "Grazie per il tuo messaggio! Ti risponderò subito :)",
      errorMessage:
        "Oops... qualcosa è andata storta. Se possibile mi invii una mail su <span>bio.tarik</span>@<span>gmail</span><span>.com</span>"
    }
  }
};
export function switchLang(newLang) {
  if (langs.indexOf(newLang) < 0) {
    return;
  }
  lang.set(newLang);
  i18n.set(i18nTemplateLiteralCurried(newLang));
}

const DEFAULT_LANG = "en";

const i18nTemplateLiteralCurried = lang => literals => {
  return labelsByLang[lang][literals.map(literal => literal).join("")];
};

export const lang = writable(DEFAULT_LANG);
export const i18n = writable(i18nTemplateLiteralCurried(DEFAULT_LANG));
