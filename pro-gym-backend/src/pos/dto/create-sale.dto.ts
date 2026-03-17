export class CreateSaleDto {
  member_id!: string;
  total!: number;
  payment_method!: string;
  items!: {
    type: string;
    id: string;
    quantity: number;
    price: number;
    member_id: string;
    total: number;
    payment_method: string;
    shift_id: string; // ← agregar esto
    // items: SaleItem[];
  }[];
}
