import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {
  IChartData,
  IChartDataSet,
  IChartDisplay,
  IChartType,
  IChartTypeExtended,
} from './chart.interfaces';

// Register all Chart.js components
Chart.register(...registerables);

/**
 * Chart Component
 *
 * A Chart.js-based chart component for displaying various chart types.
 * Supports multiple charts in a responsive grid layout.
 *
 * @example
 * ```html
 * <i-chart
 *   [charts]="myCharts"
 *   height="25rem">
 * </i-chart>
 * ```
 *
 * @example
 * ```typescript
 * myCharts: IChartData[] = [
 *   {
 *     chartId: 'sales-chart',
 *     chartType: 'bar',
 *     labels: ['Jan', 'Feb', 'Mar'],
 *     dataSets: [{
 *       label: 'Sales',
 *       data: [100, 200, 150],
 *       backgroundColors: ['--blue-500', '--green-500', '--orange-500']
 *     }]
 *   }
 * ];
 * ```
 */
@Component({
  selector: 'i-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class IChart implements AfterViewInit, OnDestroy, OnChanges {
  /**
   * Array of chart data objects to render
   */
  @Input() charts: IChartData[] = [];

  /**
   * Default height for charts
   * @default '20rem'
   */
  @Input() height = '20rem';

  /**
   * Whether charts should be responsive
   * @default true
   */
  @Input() responsive = true;

  /**
   * Reference to all canvas elements
   * @internal
   */
  @ViewChildren('chartCanvas')
  canvasElements!: QueryList<ElementRef<HTMLCanvasElement>>;

  /**
   * Array of display configurations for each chart
   * @internal
   */
  chartDisplays: IChartDisplay[] = [];

  /**
   * Chart.js instances for cleanup
   * @internal
   */
  private chartInstances: Chart[] = [];

  /**
   * Flag to track if component has initialized
   * @internal
   */
  private initialized = false;

  /**
   * Reference to pending animation frame for cleanup
   * @internal
   */
  private pendingAnimationFrame: number | null = null;

  ngAfterViewInit(): void {
    this.initialized = true;
    this.initializeCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['charts'] && this.initialized) {
      this.destroyCharts();
      this.initializeCharts();
    }
  }

  ngOnDestroy(): void {
    this.cancelPendingInitialization();
    this.destroyCharts();
  }

  /**
   * Cancel any pending chart initialization
   * @internal
   */
  private cancelPendingInitialization(): void {
    if (this.pendingAnimationFrame !== null) {
      cancelAnimationFrame(this.pendingAnimationFrame);
      this.pendingAnimationFrame = null;
    }
  }

  /**
   * Initialize all charts
   * @internal
   */
  private initializeCharts(): void {
    this.chartDisplays = this.charts.map((chart) =>
      this.transformToChartDisplay(chart)
    );

    // Cancel any pending initialization
    this.cancelPendingInitialization();

    // Use requestAnimationFrame for proper timing after view update
    this.pendingAnimationFrame = requestAnimationFrame(() => {
      this.pendingAnimationFrame = null;
      this.canvasElements.forEach((canvasRef, index) => {
        const chartDisplay = this.chartDisplays[index];
        if (chartDisplay && canvasRef) {
          const chartInstance = this.createChartInstance(
            canvasRef.nativeElement,
            chartDisplay
          );
          this.chartInstances.push(chartInstance);
        }
      });
    });
  }

  /**
   * Destroy all chart instances
   * @internal
   */
  private destroyCharts(): void {
    this.chartInstances.forEach((chart) => {
      chart.destroy();
    });
    this.chartInstances = [];
    this.chartDisplays = [];
  }

  /**
   * Create a Chart.js instance
   * @internal
   */
  private createChartInstance(
    canvas: HTMLCanvasElement,
    display: IChartDisplay
  ): Chart {
    const config: ChartConfiguration = {
      type: display.type,
      data: display.data as ChartConfiguration['data'],
      options: display.options as ChartConfiguration['options'],
    };

    return new Chart(canvas, config);
  }

  /**
   * Transform IChartData to IChartDisplay
   * @internal
   */
  private transformToChartDisplay(chart: IChartData): IChartDisplay {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
    const textColorSecondary =
      documentStyle.getPropertyValue('--text-color-secondary') || '#666';
    const surfaceBorder =
      documentStyle.getPropertyValue('--surface-border') || '#ddd';

    const chartType = this.mapChartType(chart.chartType);
    const height = this.getChartHeight(chart.chartType);
    const options = this.getChartOptions(
      chart.chartType,
      textColor,
      textColorSecondary,
      surfaceBorder
    );

    const data = {
      labels: chart.labels,
      datasets: chart.dataSets.map((dataset) =>
        this.transformDataset(dataset, documentStyle)
      ),
    };

    return {
      type: chartType,
      data,
      options,
      height,
    };
  }

  /**
   * Map custom chart type strings to Chart.js types
   * @internal
   */
  private mapChartType(chartType: IChartTypeExtended): IChartType {
    const typeMap: Record<IChartTypeExtended, IChartType> = {
      bar: 'bar',
      'bar-stack': 'bar',
      'bar-large': 'bar',
      'bar-horizontal': 'bar',
      pie: 'pie',
      doughnut: 'doughnut',
      line: 'line',
      scatter: 'scatter',
      bubble: 'bubble',
      polarArea: 'polarArea',
      radar: 'radar',
    };

    return typeMap[chartType] || 'bar';
  }

  /**
   * Get chart height based on chart type
   * @internal
   */
  private getChartHeight(chartType: IChartTypeExtended): string {
    if (chartType === 'bar-large') {
      return '40rem';
    }
    return this.height;
  }

  /**
   * Get chart options based on chart type
   * @internal
   */
  private getChartOptions(
    chartType: IChartTypeExtended,
    textColor: string,
    textColorSecondary: string,
    surfaceBorder: string
  ): unknown {
    const baseOptions = {
      maintainAspectRatio: false,
      responsive: this.responsive,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return {
          ...baseOptions,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'bar-stack':
        return {
          ...baseOptions,
          scales: this.getStackedBarScales(textColorSecondary, surfaceBorder),
        };

      case 'bar-large':
        return {
          ...baseOptions,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'bar-horizontal':
        return {
          ...baseOptions,
          indexAxis: 'y' as const,
          scales: this.getBarScales(textColorSecondary, surfaceBorder),
        };

      case 'pie':
      case 'doughnut':
        return {
          ...baseOptions,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
              position: 'bottom' as const,
            },
          },
        };

      case 'line':
        return {
          ...baseOptions,
          scales: this.getLineScales(textColorSecondary, surfaceBorder),
        };

      case 'radar':
        return {
          ...baseOptions,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            r: {
              grid: {
                color: surfaceBorder,
              },
              pointLabels: {
                color: textColorSecondary,
              },
            },
          },
        };

      case 'polarArea':
        return {
          ...baseOptions,
          scales: {
            r: {
              grid: {
                color: surfaceBorder,
              },
            },
          },
        };

      default:
        return baseOptions;
    }
  }

  /**
   * Get scales configuration for bar charts
   * @internal
   */
  private getBarScales(textColorSecondary: string, surfaceBorder: string) {
    return {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    };
  }

  /**
   * Get scales configuration for stacked bar charts
   * @internal
   */
  private getStackedBarScales(
    textColorSecondary: string,
    surfaceBorder: string
  ) {
    return {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    };
  }

  /**
   * Get scales configuration for line charts
   * @internal
   */
  private getLineScales(textColorSecondary: string, surfaceBorder: string) {
    return {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    };
  }

  /**
   * Transform dataset with resolved colors
   * @internal
   */
  private transformDataset(dataset: IChartDataSet, documentStyle: CSSStyleDeclaration) {
    return {
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColors.map((color) => {
        const resolvedColor = this.resolveColor(color, documentStyle);
        return this.addTransparency(resolvedColor);
      }),
      borderColor: dataset.backgroundColors.map((color) =>
        this.resolveColor(color, documentStyle)
      ),
      borderWidth: 1,
    };
  }

  /**
   * Resolve CSS variable to hex color or return as-is
   * @internal
   */
  private resolveColor(color: string, documentStyle: CSSStyleDeclaration): string {
    if (color.startsWith('--')) {
      const resolvedColor = documentStyle.getPropertyValue(color).trim();
      return resolvedColor || color;
    }
    return color;
  }

  /**
   * Add transparency to a hex color
   * @internal
   */
  private addTransparency(color: string): string {
    // If it's a hex color, add transparency
    if (color.startsWith('#')) {
      return color + 'bf'; // ~75% opacity
    }
    return color;
  }

  /**
   * Get the height style for a chart display
   * @param display - The chart display configuration
   * @returns The height CSS value
   */
  getChartHeightStyle(display: IChartDisplay): string {
    return display.height || this.height;
  }

  /**
   * Get the number of active chart instances (for testing)
   * @returns The count of active chart instances
   */
  getChartInstanceCount(): number {
    return this.chartInstances.length;
  }
}
