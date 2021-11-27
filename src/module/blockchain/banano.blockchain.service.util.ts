import { WodoEvent, } from "@wodo-platform/wp-api-definitions/dist/api/event/wodo.event";
import { WodoEventName, EVENT_BLOCKCHAIN_TRANSACTION_INITIATED } from "@wodo-platform/wp-api-definitions/dist/api/event/wodo.event.catalog";
import { BlockchainTransactionSendPayload } from "@wodo-platform/wp-api-definitions/dist/api/dto/wp-blockchain-payment-service/BlockchainTransactionSendPayload";
import { BlockchainTransactionInitiatedPayload } from "@wodo-platform/wp-api-definitions/dist/api/dto/wp-blockchain-payment-service/BlockchainTransactionInitiatedPayload";

import { BlockchainTransactionParams } from "@wodo-platform/wp-shared-lib/dist/wodoplatform/blockchain/api/blockchain.transaction.params";


export class BananoBlockchainServiceUtil {

    public static newBlockchainTransactionInitiatedEvent(params: BlockchainTransactionParams, transactionId:string) : WodoEvent {

        let senderId:string = params.senderId;
        let receiverId:string = params.receiverId;
        let assetId:string = params.assetId;
        let fromAccountAddress:string = params.fromAccountAddress;
        let toAccountAddress:string = params.toAccountAddress;
        let amount:string = params.amount;

        let transactionPayload: BlockchainTransactionInitiatedPayload = new BlockchainTransactionInitiatedPayload(
            {
                senderId: senderId,
                receiverId: receiverId,
                assetId: assetId,
                fromAccountAddress: fromAccountAddress,
                toAccountAddress: toAccountAddress,
                amount: amount,
                sentAt: (new Date()).toTimeString(),
                attribute1: transactionId
            }
        );

        let tenantId:number = params.attributes.get("tenantId");
        let correlationId:string = params.attributes.get("correlationId");
        let senderServiceId:string = params.attributes.get("senderServiceId");

        let event: WodoEvent = new WodoEvent(tenantId,correlationId,senderServiceId,EVENT_BLOCKCHAIN_TRANSACTION_INITIATED,transactionPayload);

        return event;
    }
    public static convertTransactionSendEvent2BlockChainTransactionParams(event: WodoEvent): BlockchainTransactionParams {

        let tenantId: number = event.tenantId;
        let correlationId: string = event.correlationId;
        let senderServiceId: string = event.senderId;
        let wodoEventName: WodoEventName = event.wodoEventName;

        let transactionPayload: BlockchainTransactionSendPayload = event.payload as BlockchainTransactionSendPayload

        let senderId:string = event.payload._senderId;
        let receiverId:string = event.payload._receiverId;
        let assetId:string = event.payload._assetId;
        let fromAccountAddress:string = event.payload._romAccountAddress;
        let toAccountAddress:string = event.payload._toAccountAddress;
        let amount:string = event.payload._amount;

        let attributes: Map<string, any> = new Map<string, any>();
        attributes.set("tenantId",tenantId);
        attributes.set("correlationId",correlationId);
        attributes.set("senderServiceId",senderServiceId);
        attributes.set("wodoEventName",wodoEventName);
        attributes.set("seed",event.payload._attribute1);

        let params: BlockchainTransactionParams = {
            senderId: senderId,
            receiverId: receiverId,
            assetId: assetId,
            fromAccountAddress: fromAccountAddress,
            toAccountAddress: toAccountAddress,
            amount:amount,
            attributes: attributes
        };
        return params;
    };
}