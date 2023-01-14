interface InterfaceError { message: string, field: string }

export interface ResponseErrorType  {
  errorsMessages: Array<InterfaceError>
}
