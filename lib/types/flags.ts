export type Flag = {
  enabled: boolean;
  description?: string;
};

export type Flags = {
  [key: string]: Flag;
};
