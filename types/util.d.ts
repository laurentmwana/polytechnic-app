export interface StateActionModel {
  state: boolean;
}

interface ValidatorErrorProps {
  message: string;
  errors: {
    [key: string]: string[];
  };
}
