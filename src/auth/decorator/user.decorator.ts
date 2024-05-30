import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request:Express.Request = context.switchToHttp().getRequest();
    // console.log(request.user);
    // return request.user;
    const user = request.user;
    if(key != null) {
      return user?.[key]
    } else {
      return user
    }
  },
);