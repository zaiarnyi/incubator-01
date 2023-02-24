import {Router} from 'express';
import {
  detectRefreshTokenFromCookie,
  validationAuthLogin,
  validationBearer,
  validationConfirmRegistrationCode,
  validationRefreshToken
} from '../middleware/auth';
import {
  validationUserEmail,
  validationUserLogin,
  validationUserNewPassword,
  validationUserNewPasswordCode,
  validationUserPassword
} from '../middleware/users';
import {
  apiLimiterLogin,
  apiLimiterRecovery,
  apiLimiterRecoveryPassword,
  apiLimiterRegistration,
  apiLimiterRegistrationConfirm,
  apiLimiterResend
} from './utils/rateLimits';
import {authController} from './index';


export const authRouter = Router();


authRouter.post('/login',
  apiLimiterLogin,
  validationAuthLogin,
  authController.login.bind(authController));
authRouter.get('/me',
  validationBearer,
  authController.me.bind(authController));

authRouter.post('/registration',
  apiLimiterRegistration,
  validationUserLogin,
  validationUserEmail,
  validationUserPassword,
  authController.registration.bind(authController));

authRouter.post('/registration-confirmation',
  apiLimiterRegistrationConfirm,
  validationConfirmRegistrationCode,
  authController.confirmRegistration.bind(authController));

authRouter.post('/registration-email-resending',
  apiLimiterResend,
  validationUserEmail,
  authController.resendEmailForRegistration.bind(authController));

authRouter.post('/refresh-token',
  detectRefreshTokenFromCookie,
  authController.refreshToken.bind(authController));

authRouter.post('/logout',
  validationRefreshToken,
  authController.logout.bind(authController));

authRouter.post('/password-recovery',
  apiLimiterRecovery,
  validationUserEmail,
  authController.recoveryPassword.bind(authController));

authRouter.post('/new-password',
  apiLimiterRecoveryPassword,
  validationUserNewPassword,
  validationUserNewPasswordCode,
  authController.createNewPassword.bind(authController));

// cron.schedule('0 0 * * *', () => {
//   authService.removeUserIsNotConfirmEmail();
// });


