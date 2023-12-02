import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageTreeModule } from '@modules/page-tree/page-tree.module';

@Component({
  selector: 'app-layout-pages',
  templateUrl: './layout-pages.page.html',
  styleUrls: ['./layout-pages.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PageTreeModule]
})
export class LayoutPagesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
