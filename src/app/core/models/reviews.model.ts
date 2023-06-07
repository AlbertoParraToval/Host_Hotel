export interface Reviews {
  id: number;
  docId?:string;
  id_user:number;
  id_hoteles:number;
  fecha:Date;
  rating: number;
  text_review: string;
}