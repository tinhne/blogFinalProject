import { FastifyRequest, FastifyReply } from 'fastify';

import { AuthUser } from '../../types/fastify'; // Import kiểu `AuthUser`

// Middleware xác thực người dùng
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    request.user = request.user as AuthUser; // Gán kiểu AuthUser để tránh lỗi TS
  } catch (err) {
    reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
}

// Middleware xác thực Admin
export async function authenticateAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    request.user = request.user as AuthUser; // Ép kiểu lại để tránh lỗi TS

    if (!(request.user as AuthUser).isAdmin) {
      return reply.status(403).send({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Admin privileges required',
      });
    }
  } catch (err) {
    reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
}

// Middleware kiểm tra quyền sở hữu tài nguyên
export function authenticateOwner(paramIdField = 'id') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      //   request.user = request.user as AuthUser; // Ép kiểu đúng

      const resourceId = request.params[paramIdField];

      if (!resourceId) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: `Missing resource ID parameter: ${paramIdField}`,
        });
      }

      if ((request.user as AuthUser).isAdmin) {
        return; // Admin có quyền truy cập tất cả
      }

      if (resourceId !== (request.user as AuthUser).id) {
        return reply.status(403).send({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have permission to access this resource',
        });
      }
    } catch (err) {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }
  };
}
