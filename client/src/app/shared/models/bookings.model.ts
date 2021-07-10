export interface Bookings {
  rows: Array<ClientBookings>;
}

interface ClientBookings {
  idNum: string;
  name: string;
  surname: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  postal: string;
  manufacturer: string;
  vehicle_name: string;
  booking_date: Date;
  created_at: Date;
}
