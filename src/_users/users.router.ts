import {Request, Response, Router} from 'express';
import {userQueryRepository} from './repository/query.repository';
import {usersService} from './services/users.service';
import {usersRepository} from './repository/users.repository';

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
usersRouter.delete('/:id', async (req: Request, res: Response)=> {
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
