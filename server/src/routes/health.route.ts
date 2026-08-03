import { type Request, type Response, Router } from 'express';

import { prisma } from '../config/database';
import { sendError, sendSuccess } from '../utils/apiResponse.util';

const router = Router();

/**
 * GET /api/v1/health
 * Checks application uptime and verifies active database connectivity.
 * Returns 200 OK if healthy, or 503 Service Unavailable if database is unreachable.
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    // Perform lightweight query to test database connection
    await prisma.$queryRaw`SELECT 1`;

    sendSuccess(
      res,
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        database: 'connected',
      },
      200,
    );
  } catch (error) {
    console.error('❌ Health check failed - Database unreachable:', error);
    sendError(res, 'Service Unavailable: Database connection failed', 503, {
      status: 'unhealthy',
      database: 'disconnected',
    });
  }
});

export default router;
