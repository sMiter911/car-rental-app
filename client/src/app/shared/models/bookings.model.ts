export interface Bookings {
  rows: Array<ClientBookings>;
}

interface ClientBookings {
  idNum: string;
  clientID:number;
  name: string;
  surname: string;
  email: string;
  phone: number;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
  manufacturer: string;
  vehicle_name: string;
  booking_date: Date;
  created_at: Date;
}
