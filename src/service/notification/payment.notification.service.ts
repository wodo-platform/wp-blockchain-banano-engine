import { Injectable, Logger } from '@nestjs/common';
import PaymentNotification from './model/payment.notification';


@Injectable()
export class PaymentNotificationService {

  private readonly logger = new Logger(PaymentNotificationService.name);

  private notificationCache = new Map();

  constructor() {
    this.logger.debug("#### new instance ####");
  }

  public async sendPaymentNotification(paymentNotification:PaymentNotification): Promise<any> {
    this.logger.debug(`sending notification [${JSON.stringify(paymentNotification)}]`);
    return await this.notificationCache.set(paymentNotification.id,paymentNotification);
  }

  public async findAll() : Promise<any> {
    let array = Array.from(this.notificationCache, ([id, value]) => ({ id, value }));
    return array;
  }

  public async findBySenderAccount(account:string) : Promise<any> {
    let found = [];
    for (let value of this.notificationCache.values()) {
      let notf:PaymentNotification = value as PaymentNotification;
      if(notf.senderAccountAddress == account) {
        found.push(notf);
      }
    }
    return found;
  }

  public async findByReceiverAccount(account:string) : Promise<any> {
    let found = [];
    for (let value of this.notificationCache.values()) {
      let notf:PaymentNotification = value as PaymentNotification;
      if(notf.receiverAccountAddress == account) {
        found.push(notf);
      }
    }
    return found;
  }

}