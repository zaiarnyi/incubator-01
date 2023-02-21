import {securityCollection} from '../../DB';

export const querySecurityRepository = {
  async getAllActiveSession(userId: string) {
    return securityCollection.find({userId}, {projection: {
          ip: 1,
          title: 1,
          lastActiveDate: 1,
          deviceId: 1,
          _id: 0
      }}).toArray();
  },
  async detectDeviceId(deviceId: string = ''){
    return securityCollection.findOne({deviceId});
  }
}
