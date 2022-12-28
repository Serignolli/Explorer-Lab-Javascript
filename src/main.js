import "./css/index.css"
import Imask from "imask"

const cc_Bg_Color_01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const cc_Bg_Color_02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const cc_Logo = document.querySelector(".cc-logo span:nth-child(2) img");

const color = {
  visa: ["#436D99", "#2D57F2"],
  mastercard: ["#DF6F29", "#C69347"],
  default: ["black", "gray"],
}

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  cc_Bg_Color_01.setAttribute("fill", colors[type][0]);
  cc_Bg_Color_02.setAttribute("fill", colors[type][1]);
  cc_Logo.setAttribute("src", `cc-${type}.svg`);
}

//setCardType("visa");

globalThis.setCardType = setCardType;

const security_Code = document.querySelector("#security-code")
const security_Code_Pattern = {
  mask: "0000"
}
const security_Code_Masked = IMask(security_Code, security_Code_Pattern)

const expiration_Date = document.querySelector("#expiration-date")
  const expiration_Date_Pattern = {
    mask: "MM{/}YY",
    blocks: {
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
      },
      YY: {
        mask: IMask.MaskedRange,
        from: String(new Date().getFullYear()).slice(2),
        to: String(new Date().getFullYear() + 10).slice(2),
      },
    },
  }
const expiration_Date_Masked = IMask(expiration_Date, expiration_Date_Pattern)

const card_Number = document.querySelector("#card-number")
const card_Number_Pattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function(appended, dynamic_Masked) {
    const number = (dynamic_Masked.value + appended).replace(/\D/g, "")
    const found_Mask = dynamic_Masked.compiledMasks.find(function(item) {
      return number.match(item.regex)
    })
    console.log(found_Mask)
    return found_Mask
  }
}

const card_Number_Masked = IMask(card_Number, card_Number_Pattern)

const add_Button = document.querySelector("#add-card")
add_Button.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const card_Holder = document.querySelector("#card-holder")
card_Holder.addEventListener("input", () => {
  const cc_Holder = document.querySelector(".cc-holder .value")

  cc_Holder.innerText = card_Holder.value.length === 0 ? "FULANO DA SILVA" : card_Holder.value
})

security_Code_Masked.on("accept", () => {
  updateSecurityCode(security_Code_Masked.value)
})

function updateSecurityCode(code){
  const cc_Security = document.querySelector(".cc-security .value")

  cc_Security.innerText = code.length === 0 ? "123" : code
}

card_Number_Masked.on("accept", () => {
  const card_Type = card_Number_Masked.masked.currentMask.cardtype
  setCardType(card_Type)
  updateCardNumber(card_Number_Masked.value)
})

function updateCardNumber(number) {
  const cc_Number = document.querySelector(".cc-number")
  cc_Number.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expiration_Date_Masked.on ("accept", () => {
  updateExpirationDate(expiration_Date_Masked.value)
})

function updateExpirationDate (date) {
  const cc_Expiration = document.querySelector(".cc-extra .cc-expiration .value")
  cc_Expiration.innerText = date.length === 0 ? "02/32" : date
}