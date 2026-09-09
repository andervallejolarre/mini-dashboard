//Format of the data we are actually using from FAOSTAT response
export type FaostatRecord = {
  Year: number;
  Value: number;
};

//The format of the entire response from FAOSTAT
export type FaostatResponse = {
  metadata: unknown;
  data: FaostatRecord[];
};

export type ProductionPoint = {
  year: number;
  value: number;
};