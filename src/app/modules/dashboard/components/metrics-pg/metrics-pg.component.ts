import { Component, OnInit } from '@angular/core';

import { MetricsService } from '@modules/dashboard/services/metrics.service';

@Component({
  selector: 'app-metrics-pg',
  templateUrl: './metrics-pg.component.html',
  styleUrls: ['./metrics-pg.component.scss'],
})
export class MetricsPgComponent implements OnInit {
  public dataMINIS: any = []
  public dataOTHERS: any = []
  public dataTAT: any = []
  public typologyGroup: any = []

  constructor(private _metricsService: MetricsService) { }

  ngOnInit() {
    this.getMetricsList()
  }

  getMetricsList() {
    const idVendedor = localStorage.getItem("codemp_b");
    this._metricsService.getTypologyMetrics(idVendedor).then(() => {
      this.dataMINIS = this._metricsService.dataMINIS
      this.dataOTHERS = this._metricsService.dataOTHERS
      this.dataTAT = this._metricsService.dataTAT
    })
  }

  toggleDropdown(e: any) {
    e.target.closest(
      '.o-checkout__dropdown'
    ).classList.toggle('is-dropdown-show');
  }

}
