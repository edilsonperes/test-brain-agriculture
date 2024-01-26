import { Request, Response } from 'express';
import { Controller } from './Controller.js';
import { FarmRepository } from '../../../application/repository/FarmRepository.js';
import { GenerateDashboard } from '../../../application/usecases/GenerateDashboard.js';
import { HttpStatus } from './HttpStatus.js';

export class DashboardController implements Controller {
  constructor(private farmRepository: FarmRepository) {}

  handle = async (_request: Request, response: Response): Promise<void> => {
    try {
      const generateDashboard = new GenerateDashboard(this.farmRepository);
      const dashboardData = await generateDashboard.exec();
      response.status(HttpStatus.OK).json(dashboardData);
    } catch (error: unknown) {
      console.error(error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
