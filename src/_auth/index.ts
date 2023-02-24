import {AuthController} from './controller/auth.controller';
import {AuthService} from './service/auth.service';


export const authService = new AuthService();
export const authController = new AuthController(authService);
