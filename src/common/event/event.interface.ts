export default interface WodoEvent {
    eventType:string,
} 

export const BLOCKCHAIN_TRANSACTION_RECEIVED : WodoEvent = {
    eventType : "blockhain_transaction_received"
}
 