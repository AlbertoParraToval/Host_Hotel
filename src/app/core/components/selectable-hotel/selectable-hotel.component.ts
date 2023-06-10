import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Reviews, hotels } from '../../models';
import { HotelsService } from '../../services';
import { IonAccordionGroup } from '@ionic/angular';
export const REVIEWS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectableHotelComponent),
  multi: true
};


@Component({
  selector: 'app-selectable-hotel',
  templateUrl: './selectable-hotel.component.html',
  styleUrls: ['./selectable-hotel.component.scss'],
})
export class SelectableHotelComponent implements OnInit {
  @Input() hotels: hotels;
  @Output() hotelChange: EventEmitter<hotels> = new EventEmitter<hotels>();

  selectedHotel:hotels=null;
  propagateChange = (_: any) => { }
  isDisabled:boolean = false;
  constructor(private hoteSvc:HotelsService) { }

  async writeValue(obj: any) {
    try {
      this.selectedHotel = await this.hoteSvc.gethotelById(obj); 
      console.log(obj) 
    } catch (error) {
      console.log("No se ha podido recupera los datos: "+ error);
    }
    
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit() {}

  getHotelList(){
    return this.hoteSvc.gethotels();
  } 

  onHotelClicke(hoteldata:hotels, accordion:IonAccordionGroup){
    this.selectedHotel = hoteldata;
    accordion.value='';
    this.propagateChange(this.selectedHotel.docId);
    console.log(hoteldata)
  }

}
