import {Request, Response} from 'express';
import {myValidationResult} from '../index';
import {NOT_FOUND_BLOG_ID} from '../constants';

export const isIsoDate = (dateString: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date) && date.toISOString() === dateString;
}

type TypeErrorObject = {field: string, message: string};

export const showError = (field: string, message:string): TypeErrorObject=> ({field, message});


export const detectErrors = (req: Request, res: Response)=> {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    let statusCode = 400;
    if(errors.array()[0].message === NOT_FOUND_BLOG_ID){
      statusCode = 404;
    }
    res.status(statusCode).json({ errorsMessages: errors.array({onlyFirstError: true}) });
    return true
  }
}
