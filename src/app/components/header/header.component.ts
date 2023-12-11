import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() hasSearch = true;
  @Output() onSearch = new EventEmitter();
  searchValue = '';
  constructor(
    private mainService: MainService,
    private stateService: StateService,
  ) { }

  ngOnInit(): void {
  }

}
