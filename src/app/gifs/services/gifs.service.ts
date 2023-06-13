import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  //SI no estuviera providedIn root tocaría ponerlo en providers de cada módulo donde
  //se vaya a usar
  providedIn: 'root'
})
export class GifsService {

  //Es privado para que la data solo se pueda modificar desde mi servicio, se le hace
  //un getter para exponer lo que quiero
  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];
  private apiKey: string = 'ZC17EU5MKAjqAkg90LzkySq73bXOwqFI';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
   }


  //Se hace una copia ya que los arreglos en JS pasan por referencia
  get tagsHistory(){
    return [...this._tagsHistory];
  }


  private organizeHistory(tag:string):void{
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }


  private loadLocalStorage():void{
    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
    if (this.tagsHistory.length === 0) return;
    this.searchTag(this.tagsHistory[0]);
  }


  //SEARCHTAG METHOD CON PROMERSAS
  // async searchTag(tag:string):Promise<void> {
  //   if(tag.length === 0) return;
  //   this.organizeHistory(tag);

  //   fetch('https://api.giphy.com/v1/gifs/search?api_key=ZC17EU5MKAjqAkg90LzkySq73bXOwqFI&q=valorant&limit=10')
  //   .then( resp => resp.json())
  //   .then( data => console.log(data))

  // }


  //SEARCHTAG METHOD CON PROMESAS Y AWAIT
  // async searchTag(tag:string):Promise<void> {
  //   if(tag.length === 0) return;
  //   this.organizeHistory(tag);

  //   const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=ZC17EU5MKAjqAkg90LzkySq73bXOwqFI&q=valorant&limit=10')
  //   const data = await resp.json();
  //   console.log(data);


  // }


  //SEARCHTAG METHOD CON OBSERVABLES. HTTPCLIENT
  searchTag(tag:string):void {
    if(tag.length === 0) return;
    this.organizeHistory(tag);


    const params = new HttpParams()
     .set('api_key', this.apiKey)
     .set('limit', '10')
     .set('q', tag)


    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe(resp => {
        this.gifList = resp.data;

      })


  }

}
