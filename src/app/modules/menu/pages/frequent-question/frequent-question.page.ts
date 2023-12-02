import { Component, OnInit } from '@angular/core';
import { MenuModule } from '@modules/menu/menu.module';
import { SupportService } from '@modules/menu/services/support.service';


@Component({
  selector: 'app-frequent-question',
  templateUrl: './frequent-question.page.html',
  styleUrls: ['./frequent-question.page.scss'],
  standalone: true,
  imports: [MenuModule]
})
export class FrequentQuestionPage implements OnInit {
  frecuentQuestionsList: any = []

  constructor(private _supportService: SupportService) {
    this.getFrequentQuestions()
  }

  ngOnInit() {
  }

  getFrequentQuestions() {
    this._supportService.getFrequentQuestions$().subscribe({
      next: (res) => {
        const { data } = res
        const dataQuestions = JSON.parse(data)
        this.frecuentQuestionsList = dataQuestions.data
      }
    })
  }

  toggleDropdownSupport(e: any) {
    e.target.closest(
      ".js-dropdown-target"
    ).classList.toggle("is-dropdown-show")
  }

}
