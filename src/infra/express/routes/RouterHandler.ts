import { Router } from 'express';

export interface RouterHander {
  route: string;
  handler: (router: Router) => void;
}
