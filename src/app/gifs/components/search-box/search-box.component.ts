import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
    <!-- el #txtTagInput es una referencia local, de esa forma es que se identifica todo el input
     en el template html y lo puedo usar para mandar el value del input. El keyup ya soporta
    enter para no hacer peticiones https con cada tecla sino cuando se oprima enter-->
    <input
      type="text"
      class="form-control"
      placeholder="Buscar gifs"
      (keyup.enter)="searchTag()"
      #txtTagInput
    >
  `
})
export class SearchBoxComponent {

  //ViewChild me sirve para hacer un binding de un elemento html a una propiedad, en este
  //caso con la referencia local en el tamplate html
  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;


  constructor(
    private gifsService: GifsService
  ){}



  // searchTag(newTag:String):void{
  //   console.log(newTag);

  // }

  //Método haciendo uso de @ViewChild
  searchTag():void{
    const newTag = this.tagInput.nativeElement.value;
    this.gifsService.searchTag(newTag);
    this.tagInput.nativeElement.value = '';
  }

}
