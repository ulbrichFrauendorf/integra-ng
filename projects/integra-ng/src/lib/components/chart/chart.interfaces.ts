/**
 * Supported Chart.js chart types
 */
export type IChartType =
  | 'bar'
  | 'line'
  | 'scatter'
  | 'bubble'
  | 'pie'
  | 'doughnut'
  | 'polarArea'
  | 'radar';

/**
 * Dataset configuration for a chart
 */
export interface IChartDataSet {
  /** Label for this dataset (appears in legend) */
  label: string;
  /** Numerical data values */
  data: number[];
  /** CSS variable names or hex colors for backgrounds (e.g., '--blue-500') */
  backgroundColors: string[];
}

/**
 * Input data for creating a chart
 */
export interface IChartData {
  /** Optional unique identifier for the chart */
  chartId?: string;
  /**
   * Chart type string. Supports:
   * - 'bar' - standard bar chart
   * - 'bar-stack' - stacked bar chart
   * - 'bar-large' - bar chart with larger height (40rem)
   * - 'bar-horizontal' - horizontal bar chart
   * - 'pie' - pie chart
   * - 'doughnut' - doughnut chart
   * - 'line' - line chart
   * - 'scatter' - scatter plot
   * - 'bubble' - bubble chart
   * - 'polarArea' - polar area chart
   * - 'radar' - radar chart
   */
  chartType: string;
  /** Labels for the x-axis or data points */
  labels: string[];
  /** Array of datasets to display */
  dataSets: IChartDataSet[];
}

/**
 * Internal display configuration for Chart.js
 */
export interface IChartDisplay {
  /** Chart.js data object */
  data: unknown;
  /** Chart.js options object */
  options: unknown;
  /** Chart.js chart type */
  type: IChartType;
  /** Optional height override */
  height?: string;
}
