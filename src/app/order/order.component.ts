import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Order } from './model/Order';
import { Observable } from 'rxjs';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: []
})
export class OrderComponent implements OnInit, OnDestroy {

  order$: Observable<Order[]>;
  all: Order[];

  constructor(private service: OrderService) { }
  
  ngOnInit() {
    this.service.startOrderSource();
    this.order$ = this.service.orderData;
  }

  ngOnDestroy() {
    this.service.onClose();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  unloadHandler(event) {
   console.log('unloadHandler');
   this.service.onClose();
  }

}
