export interface StateActionModel {
  state: boolean;
}

export interface ValidatorErrorProps {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

export interface StatisticPaymentModel {
  annual: {
    chartData: Array<{
      level: number;
      currentYear: number;
      previousYear: number;
    }>;
    totals: {
      currentYear: number;
      previousYear: number;
    };
  };
  types: {
    academic: Array<{
      year_academic_id: number;
      total: number;
    }>;
    laboratory: Array<{
      year_academic_id: number;
      total: number;
    }>;
  };
  levels: Array<{
    level_id: number;
    total: number;
  }>;
}
