import { Component, OnInit } from '@angular/core';
import { MenuModule } from '@modules/menu/menu.module';
import { SupportService } from '@modules/menu/services/support.service';

@Component({
  selector: 'app-billing-time',
  templateUrl: './billing-time.page.html',
  styleUrls: ['./billing-time.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class BillingTimePage implements OnInit {

  daysBillingList: any = []
  group: string = localStorage.getItem('group')!

  constructor(private _supportService: SupportService) { }

  ngOnInit() {
    this.getBillingTime()
  }

  getBillingTime() {
    this._supportService.getBillingTime$(this.group).subscribe({
      next: (res) => {
        const { data } = res
        const dataHours = JSON.parse(data)
        this.daysBillingList.push(dataHours)
      }
    })
  }

  toggleDropdownSupport(e: any) {
    e.target.closest(
      ".js-dropdown-target"
    ).classList.toggle("is-dropdown-show")
  }

}
