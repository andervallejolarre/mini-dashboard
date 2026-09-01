export type FaostatRecord = {
  Year: number;
  Value: number;
};

export type FaostatResponse = {
  metadata: unknown;
  data: FaostatRecord[];
};

export type ProductionPoint = {
  year: number;
  value: number;
};