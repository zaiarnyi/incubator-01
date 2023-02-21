import {Router, Request, Response} from 'express';
import {querySecurityRepository} from './repositories/querySecurity.repository';
import {validationRefreshToken, validationSecurityDeviceId} from '../middleware/auth';
import {securityRepository} from './repositories/security.repository';
import {detectErrors} from '../utils/helpers';
import {constants} from 'http2';

export const securityRouter = Router();

securityRouter.get('/devices', validationRefreshToken, async (req: Request, res: Response) => {
  const userSessions = await querySecurityRepository.getAllActiveSession(req.body.userId);
  res.json(userSessions)
});

securityRouter.delete('/devices', async (req: Request, res: Response) => {
  const result = await securityRepository.deleteAllSessionExcludeCurrent(req.body.deviceId)
  console.log(result)
  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});
securityRouter.delete('/devices/:deviceId', validationSecurityDeviceId, validationRefreshToken, async (req: Request, res: Response) => {
  if(detectErrors(req, res)){
    return null;
  }
  const detectDeviceId = await querySecurityRepository.detectDeviceId(req.params.deviceId);
  if(!detectDeviceId){
    return res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
  }
  if(detectDeviceId.userId !== req.body.userId){
    return res.sendStatus(constants.HTTP_STATUS_FORBIDDEN)
  }

  await securityRepository.deleteCurrentSession(req.params.deviceId, req.body.userId);
  res.sendStatus(constants.HTTP_STATUS_NO_CONTENT);
});


