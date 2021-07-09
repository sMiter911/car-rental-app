export interface Cars {
  rows: Array<AvailableCars>;
}


interface AvailableCars {
  manufacturer: string;
  vehicle_name: string;
  vehicle_reg: string;
  vehicle_pic: string;
}
