export type FlagEnabled =
  | boolean
  | {
      local: boolean;
      production: boolean;
    };

export type Flag = {
  enabled: FlagEnabled;
  description?: string;
};

export type Flags = {
  [key: string]: Flag;
};
