export class TagOfNewFeatures {
  tagElement: any;
  startDate: string;
  secondsOfDiff: number;
  classToHideTag: string;

  constructor(startDate: any) {
    this.startDate = startDate;
    this.secondsOfDiff = 604800 // one week
    this.classToHideTag = "is-hidden"
    this.tagElement = document.querySelector(".js-taggit")
  }

  init() {
    this.getMiliSecondOfDate()
  }

  getMiliSecondOfDate() {
    const miliSecondsdate = new Date(this.startDate).getTime();
    const nowMiliSecondsdate = new Date().getTime()
    const diferenciaEnMilisegundos = Math.abs(nowMiliSecondsdate - miliSecondsdate); // Calcular la diferencia en milisegundos
    const diferenciaEnSegundos = Math.floor(diferenciaEnMilisegundos / 1000); // Convertir la diferencia a segundos
    if (diferenciaEnSegundos > this.secondsOfDiff) {
      this.tagElement.classList.add(this.classToHideTag)
    }
  }
}
