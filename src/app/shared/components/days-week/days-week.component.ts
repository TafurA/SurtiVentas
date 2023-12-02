import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-days-week',
  templateUrl: './days-week.component.html',
  styleUrls: ['./days-week.component.scss'],
})
export class DaysWeekComponent implements OnInit {
  public today = new Date(); // Get now date
  protected daysOfWeek: any = []

  constructor() { }

  ngOnInit() {
    this.getWeekNumber()
  }

  /**
   * Función para obtener los días de la semana
   *
   * @memberof ListStoresPage
   */
  getWeekNumber() {
    const today = new Date(); // Obtener la fecha actual
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Obtener el primer día de la semana actual (lunes)
    const daysOfWeek = []; // Crear un array para almacenar los días de la semana

    // Recorrer los siguientes 7 días (una semana)
    for (let i = 0; i < 6; i++) {
      const currentDay = new Date(firstDayOfWeek);
      currentDay.setDate(firstDayOfWeek.getDate() + i);
      daysOfWeek.push(currentDay);
    }

    // Formatear los días de la semana como cadenas de texto
    daysOfWeek.map(
      day => {
        const dateSeparated = {
          dayString: day.toLocaleDateString('es-ES', { weekday: 'short' }),
          dayNumeric: day.toLocaleDateString('es-ES', { day: 'numeric' }),
        }
        this.daysOfWeek.push(dateSeparated)
      }
    );
  }

}
