import {Request, Response, Router} from 'express';
import {userQueryRepository} from './repository/query.repository';
import {usersService} from './services/users.service';

export const usersRouter = Router();

usersRouter.get('/', async (req: Request, res: Response)=> {
  const users = await userQueryRepository.getAllUsers(req.query);
  res.json(users);
});
usersRouter.post('/', async (req: Request, res: Response)=> {
  const resultCreateUser = await usersService.createUser(req.body);
  if(!resultCreateUser){
    res.sendStatus(400);
  }
  res.json(resultCreateUser);
});
usersRouter.delete('/', (req: Request, res: Response)=> {});
