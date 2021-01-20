import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export default class AdminClient {
  public readonly client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_CONNECTION_URL],
        queue: 'admin',
      },
    });
  }
}
