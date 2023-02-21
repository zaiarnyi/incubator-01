import UAParser from 'ua-parser-js';
import {securityCollection} from '../../DB';
import jwt from 'jsonwebtoken';
import {UserFromJWT} from '../../types/authTypes';
import {addMinutes} from '../../utils/helpers';
import {TOKEN_EXPIRE_TIME} from '../../constants/token';

export const securityRepository = {
  async saveDevice(userAgent: string = '', ip: string = '', token: string, isUpdateDeviceId: boolean = false){
    let deviceId = '';
    let userId = '';
    try{
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as UserFromJWT;
      deviceId = payload.deviceId as string;
      userId = payload.id as string;
    }catch (e) {
      return null;
    }
   try {
     const parse = new UAParser();
     parse.setUA(userAgent);
     // const detectGeo = geoIp.lookup(ip);

     const body = {
       title: '',
       ip,
       lastActiveDate: new Date(),
       expireAt: addMinutes(new Date(), TOKEN_EXPIRE_TIME.refreshToken).getTime(),
       deviceId,
       city: '',
       country: '',
       // city: detectGeo?.city || null,
       // country: detectGeo?.country || null,
       userId,
     }

     if(userAgent && Object.values(parse.getDevice()).some(item=> !!item?.length)){
       body.title = `${parse.getDevice().vendor} ${parse.getDevice().model}/${parse.getOS().name} ${parse.getOS().version}/${parse.getBrowser().name}`
     }
     const detectPrevSession = await securityCollection.findOne({userId, ...(isUpdateDeviceId && {deviceId})});
     if(detectPrevSession){
       await securityCollection.updateOne({userId}, {$set: {...body,
        deviceId: detectPrevSession.deviceId,
       }});
     } else {
       await securityCollection.insertOne(body);
     }
   }catch (e) {}
  },
  async deleteSessionUser(deviceId: string, userId: string){
    if(!deviceId || !userId) return null;
    await securityCollection.deleteOne({deviceId, userId});
  },
  async deleteAllSessionExcludeCurrent (deviceId: string, userId: string){
    return securityCollection.deleteMany({
      $and: [
        {deviceId: {$nin: [deviceId]}},
        {userId: {$nin: [userId]}},
      ]
    })
  },
  async deleteCurrentSession(deviceId: string, userId: string){
    return securityCollection.deleteOne({deviceId, userId});
  }
}
