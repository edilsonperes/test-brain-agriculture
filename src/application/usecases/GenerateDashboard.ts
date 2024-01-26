import { Farm } from '../../domain/farm/Farm.js';
import { FarmRepository } from '../repository/FarmRepository.js';
import { UseCase } from './UseCase.js';

interface PercentagePerState {
  state: string;
  percentage: number;
}

interface PercentagePerCrop {
  crop: string;
  percentage: number;
}

interface PercentagePerAreaUsage {
  usage: string;
  percentage: number;
}

interface DashboardData {
  totalFarms: number;
  totalArea: number;
  percentagePerState: PercentagePerState[];
  percentagePerCrop: PercentagePerCrop[];
  percentagePerAreaUsage: PercentagePerAreaUsage[];
}

interface FarmsPerState {
  state: string;
  farms: number;
}

interface AreaPerCrop {
  crop: string;
  area: number;
}

type AreaUsage = 'arableArea' | 'vegetationArea' | 'unknown';

interface TotalAreaPerUsage {
  usage: AreaUsage;
  totalArea: number;
}

export class GenerateDashboard implements UseCase {
  private farmsCount: number;
  private accumulatedArea: number;
  private farmsPerState: FarmsPerState[];
  private areaPerCrop: AreaPerCrop[];
  private totalAreaPerUsage: TotalAreaPerUsage[];

  constructor(private farmRepository: FarmRepository) {
    this.farmsCount = 0;
    this.accumulatedArea = 0;
    this.farmsPerState = [];
    this.areaPerCrop = [];
    this.totalAreaPerUsage = [];
  }

  private addToStateItem(state: string): void {
    const existingStateItem = this.farmsPerState.find(
      (item) => item.state === state,
    );
    if (!existingStateItem) {
      this.farmsPerState.push({
        state,
        farms: 1,
      });
      return;
    }
    existingStateItem.farms++;
  }

  private computeCrops(crops: string[], arableArea: number): void {
    const areaPerCrop = arableArea / crops.length;
    for (const crop of crops) {
      const existingCropItem = this.areaPerCrop.find(
        (item) => item.crop === crop,
      );
      if (!existingCropItem) {
        this.areaPerCrop.push({
          crop,
          area: areaPerCrop,
        });
        continue;
      }
      existingCropItem.area += areaPerCrop;
    }
  }

  private sumAreaToUsageItem(usage: AreaUsage, area: number): void {
    const existingUsageItem = this.totalAreaPerUsage.find(
      (item) => item.usage === usage,
    );
    if (!existingUsageItem) {
      this.totalAreaPerUsage.push({
        usage,
        totalArea: area,
      });
      return;
    }
    existingUsageItem.totalArea += area;
  }

  private computeData(farms: Farm[]): void {
    for (const farm of farms) {
      const { crops, state, totalArea, arableArea, vegetationArea } = farm;
      this.farmsCount++;
      this.accumulatedArea += totalArea;
      this.addToStateItem(state);
      this.computeCrops(crops, arableArea);
      this.sumAreaToUsageItem('arableArea', arableArea);
      this.sumAreaToUsageItem('vegetationArea', vegetationArea);
      const unknownArea = totalArea - (arableArea + vegetationArea);
      this.sumAreaToUsageItem('unknown', unknownArea);
    }
  }

  private getPercentagePerState(): PercentagePerState[] {
    if (!this.farmsPerState.length) {
      return [];
    }
    const percentagePerState: PercentagePerState[] = this.farmsPerState.map(
      (item) => {
        return {
          state: item.state,
          percentage: item.farms / this.farmsCount,
        };
      },
    );
    return percentagePerState;
  }

  private getPercentagePerCrop(): PercentagePerCrop[] {
    if (!this.areaPerCrop.length) {
      return [];
    }
    const totalArableArea =
      this.totalAreaPerUsage.find((item) => item.usage === 'arableArea')
        ?.totalArea ?? 0;
    if (!totalArableArea) {
      return [];
    }
    const percentagePerCrop: PercentagePerCrop[] = this.areaPerCrop.map(
      (item) => {
        return {
          crop: item.crop,
          percentage: item.area / totalArableArea,
        };
      },
    );
    return percentagePerCrop;
  }

  private getPercentagePerAreaUsage(): PercentagePerAreaUsage[] {
    if (!this.totalAreaPerUsage.length) {
      return [];
    }
    const percentagePerAreaUsage: PercentagePerAreaUsage[] =
      this.totalAreaPerUsage.map((item) => {
        return {
          usage: item.usage,
          percentage: item.totalArea / this.accumulatedArea,
        };
      });
    return percentagePerAreaUsage;
  }

  private formatPercentage<T extends { percentage: number }>(
    this: void,
    item: T,
  ): T {
    item.percentage = Math.round(item.percentage * 10000) / 10000;
    return item;
  }

  async exec(): Promise<DashboardData> {
    const limit = 10;
    let offset = 0;
    let result: Awaited<ReturnType<typeof this.farmRepository.findAll>>;
    do {
      result = await this.farmRepository.findAll(limit, offset);
      this.computeData(result);
      offset += 10;
    } while (result.length === 10);

    const dashboardData: DashboardData = {
      totalFarms: this.farmsCount,
      totalArea: this.accumulatedArea,
      percentagePerState: this.getPercentagePerState().map(
        this.formatPercentage,
      ),
      percentagePerCrop: this.getPercentagePerCrop().map(this.formatPercentage),
      percentagePerAreaUsage: this.getPercentagePerAreaUsage().map(
        this.formatPercentage,
      ),
    };
    return dashboardData;
  }
}
