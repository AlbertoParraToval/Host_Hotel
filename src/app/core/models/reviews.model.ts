export interface Reviews {
  id: number;
  docId?:string;
  id_user:string;
  id_hoteles:string;
  fecha:Date;
  rating: number;
  text_review: string;
}