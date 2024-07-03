export const getTexts = () => {
    var userLang = navigator.language || navigator.userLanguage;
    switch (userLang) {
        case "de": return germanTexts
        case "ru": return russianTexts
        case "es": return spanishTexts
        case "it": return italianTexts
        case "fr": return frenchTexts
        default: return englishTexts
    }
}


const germanTexts = {
    howMany: "Wieviele Geldbörsen möchtest Du generieren?",
    includingQRCodes: "QRCodes Erwünscht",
    congrats: "Glückwunsch. Du hast einen Schatz gefunden.",
    generate: "Generiere",
    print: "Drucken",
    reload: "Seite Neu Laden"
}
const frenchTexts = {
    howMany: "Combien de Portefeuilles de terre voulez-vous générer ?",
    includingQRCodes: "Codes QR souhaités",
    congrats: "Toutes nos félicitations. Vous avez trouvé un trésor.",
    generate: "Générer",
    print: "Imprimer",
    reload: "Rafraîchir la page"
}
const spanishTexts = {
    howMany: "¿Cuantas Carteras quieres generar?",
    includingQRCodes: "Códigos QR deseados",
    congrats: "Felicidades. Has encontrado un tesoro.",
    generate: "Generar",
    print: "Imprimir",
    reload: "Recargar página"
}
const italianTexts = {
    howMany: "Quante Portafogli vuoi generare?",
    includingQRCodes: "Codici QR desiderati",
    congrats: "Congratulazioni. Hai trovato un tesoro.",
    generate: "Creare",
    print: "Stampa",
    reload: "Ricarica la pagina"
}
const russianTexts = {
    howMany: "Сколько Kошельков вы хотите произвести?",
    includingQRCodes: "QR-коды желательны",
    congrats: "Поздравляю. Вы нашли сокровище.",
    generate: "Генерировать",
    print: "Распечатать",
    reload: "Перезагрузить страницу"
}
const englishTexts = {
    howMany: "How many wallets do you want to generate?",
    includingQRCodes: "QR codes desired",
    congrats: "Congratulations. You have found a treasure.",
    generate: "Generate",
    print: "Print",
    reload: "Reload Page"
}