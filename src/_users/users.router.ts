import {Request, Response, Router} from 'express';
import {userQueryRepository} from './repository/query.repository';
import {usersService} from './services/users.service';
import {usersRepository} from './repository/users.repository';
import {validationId, validationUserEmail, validationUserLogin, validationUserPassword} from '../middleware/users';
import {middlewareBasicAuth} from '../middleware/auth';
import {myValidationResult} from '../index';
import {INVALID_VALUE} from '../constants';
import {detectErrors} from '../utils/helpers';

export const usersRouter = Router();

usersRouter.get('/', async (req: Request, res: Response)=> {
  const users = await userQueryRepository.getAllUsers(req.query);
  res.json(users);
});
usersRouter.post('/', middlewareBasicAuth, validationUserLogin, validationUserEmail, validationUserPassword, async (req: Request, res: Response)=> {
 if(detectErrors(req, res)){
   return;
 }
  const resultCreateUser = await usersService.createUser(req.body);
  if(!resultCreateUser){
    res.status(400);
  }
  res.status(201).json(resultCreateUser);
});
usersRouter.delete('/:id', middlewareBasicAuth, validationId,  async (req: Request, res: Response)=> {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    res.status(404).json({ errorsMessages: errors.array({onlyFirstError: true}) });
    return true
  }
  const user = await userQueryRepository.getUserById(req.params.id);
  if(!user){
   return res.sendStatus(404);
  }
  const resultDeleteUser = await usersRepository.deleteUser(req.params.id);
  if(resultDeleteUser.deletedCount){
    return res.sendStatus(204);
  }
  res.sendStatus(401);
});
