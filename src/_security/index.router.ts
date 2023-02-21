import {Router, Request, Response} from 'express';
import {querySecurityRepository} from './repositories/querySecurity.repository';
import {validationRefreshToken, validationSecurityDeviceId} from '../middleware/auth';
import {securityRepository} from './repositories/security.repository';
import {detectErrors} from '../utils/helpers';

export const securityRouter = Router();


securityRouter.get('/devices', validationRefreshToken, async (req: Request, res: Response) => {
  const userSessions = await querySecurityRepository.getAllActiveSession(req.body.userId);
  res.json(userSessions)
});

securityRouter.delete('/devices', validationRefreshToken, async (req: Request, res: Response) => {
  await securityRepository.deleteAllSessionExcludeCurrent(req.body.deviceId, req.body.userId)
  res.sendStatus(204);
});
securityRouter.delete('/devices/:deviceId', validationSecurityDeviceId, validationRefreshToken, async (req: Request, res: Response) => {
  if(detectErrors(req, res)){
    return null;
  }
  await securityRepository.deleteCurrentSession(req.params.deviceId, req.body.userId);
  res.sendStatus(204);
});


