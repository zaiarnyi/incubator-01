import {Request, Response} from 'express';
import {myValidationResult} from '../index';
import {NOT_FOUND_BLOG_ID} from '../constants';
import {constants} from 'http2';
import HttpException from '../exception';

export const isIsoDate = (dateString: string): boolean => {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date) && date.toISOString() === dateString;
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}
export function minusMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() - minutes * 60000);
}

type TypeErrorObject = {field: string, message: string};

export const showError = (field: string, message:string): TypeErrorObject=> ({field, message});


export const detectErrors = (req: Request, res: Response) => {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    let statusCode = constants.HTTP_STATUS_BAD_REQUEST;
    if(errors.array()[0].message === NOT_FOUND_BLOG_ID){
      statusCode = constants.HTTP_STATUS_NOT_FOUND;
    }
    res.status(statusCode).json({ errorsMessages: errors.array({onlyFirstError: true}) });
    return true
  }
}
