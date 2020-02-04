import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order } from './model/Order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private backendUrl: string;
  private eventSource: EventSource;
  private orderDataSource: BehaviorSubject<Array<Order>> = new BehaviorSubject([]);

  orderData = this.orderDataSource.asObservable();  
  constructor(private zone: NgZone) {
    this.backendUrl = environment.backendUrl;
  } 
  public startOrderSource(): void {
    let url = [this.backendUrl, 'order'].join('/');
    console.log(url);
    this.eventSource = new EventSource(url);
    this.eventSource.onmessage = (event) => {

      console.log('got event data', event['data']);
      const newArrays = [...this.orderDataSource.value, JSON.parse(event['data'])];

      this.zone.run(() => {
        this.orderDataSource.next(newArrays);
      })

    }

    this.eventSource.onerror = (error) => {

      this.zone.run( () => {
        // readyState === 0 (closed) means the remote source closed the connection,
        // so we can safely treat it as a normal situation. Another way of detecting the end of the stream
        // is to insert a special element in the stream of events, which the client can identify as the last one.
        if(this.eventSource.readyState === 0) {
          this.eventSource.close();
          this.orderDataSource.complete();
        } else {
          this.orderDataSource.error('EventSource error: ' + error);
        }
      });
    }
  }

  public onClose() {
    this.eventSource.close();
    this.orderDataSource.complete();

  }

}
