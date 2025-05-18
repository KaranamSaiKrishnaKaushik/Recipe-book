export class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public currency: string,
    public customerReview: string,
    public reviewCount: string,
    public imageLink: string,
    public productLink: string,
    public productId: string,
    public grammage: string,
    public category: string,
    public sourceName: string,
    public isOnSale: boolean,
    public quantity: number = 0
  ) {
  }
}
