export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: string,
    public currency: string,
    public customerReview: string,
    public reviewCount: string,
    public imageLink: string,
    public productLink: string
  ) {
  }
}
