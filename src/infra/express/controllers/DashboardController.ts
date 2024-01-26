import { Request, Response } from 'express';
import { Controller } from './Controller.js';
import { FarmRepository } from '../../../application/repository/FarmRepository.js';
import { GenerateDashboard } from '../../../application/usecases/GenerateDashboard.js';

export class DashboardController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (_request: Request, response: Response): Promise<void> => {
    try {
      const generateDashboard = new GenerateDashboard(this.farmRepository);
      const dashboardData = await generateDashboard.exec();
      response.status(200).json(dashboardData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(500);
    }
  };
}
