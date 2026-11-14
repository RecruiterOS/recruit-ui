/**
 * When something in a search happened, as the host has it: an ISO 8601
 * timestamp, milliseconds since the epoch, or a Date.
 */
type ClientSearchThreadTime = string | number | Date;
/** What the thread needs of one turn of the conversation. */
interface ClientSearchThreadTurn {
    /** Tells the turn from the others: a version of the brief names the turn that wrote it by this. */
    id: string;
    /** When it was said. */
    createdAt: ClientSearchThreadTime;
}
/** What the thread needs of one version of the brief. */
interface ClientSearchThreadBriefVersion {
    /** The version's number. The highest is the brief in force now. */
    revision: number;
    /** The `id` of the turn that wrote it, or none when no turn did. */
    replyTurnId?: string | null;
    /** When it was written, which places a version no turn wrote. */
    createdAt: ClientSearchThreadTime;
}
/** What the thread needs of one delivery of people. */
interface ClientSearchThreadDelivery {
    /** When the people were delivered. */
    deliveredAt: ClientSearchThreadTime;
}
/**
 * One thing in a search's conversation, in the order it happened: a turn, a
 * version of the brief (`current` on the one in force now), or a delivery of
 * people. Each carries the host's own record, as it was given.
 */
type ClientSearchThreadItem<TTurn = ClientSearchThreadTurn, TBriefVersion = ClientSearchThreadBriefVersion, TDelivery = ClientSearchThreadDelivery> = {
    kind: "turn";
    turn: TTurn;
} | {
    kind: "brief";
    version: TBriefVersion;
    current: boolean;
} | {
    kind: "delivery";
    delivery: TDelivery;
};
/**
 * The parts of a search `clientSearchThread` puts in order. A part left out
 * has no type of its own, so the thread fits whatever a view expects there.
 */
interface ClientSearchThreadInput<TTurn extends ClientSearchThreadTurn, TBriefVersion extends ClientSearchThreadBriefVersion = never, TDelivery extends ClientSearchThreadDelivery = never> {
    /** The turns of the conversation, oldest first. */
    turns: readonly TTurn[];
    /** Each version of the brief, oldest first. */
    briefVersions?: readonly TBriefVersion[] | null;
    /** Each delivery of people, oldest first. */
    deliveries?: readonly TDelivery[] | null;
}
/**
 * A search as one conversation: each turn, each version of the brief under
 * the turn that wrote it, and each delivery of people where it landed.
 *
 * Everything is ordered by time. At the same instant a turn comes first, then
 * a version of the brief, then a delivery; within each kind the order given
 * holds, so turns the host already has in order stay in it. A version of the
 * brief that names its turn (`replyTurnId`) sits straight under that turn,
 * whatever its own time, and several written by one turn keep the order
 * given. A version that names no turn, or one the search doesn't hold, takes
 * its own place by time. The version with the highest `revision` is marked
 * `current`. A time that can't be read puts its item last.
 *
 * The host's records pass through untouched, so a thread item holds whatever
 * it was given: map them to what a view shows before or after. It reads
 * nothing but the fields named here and changes none of its input, so it can
 * run on a server.
 */
declare function clientSearchThread<TTurn extends ClientSearchThreadTurn, TBriefVersion extends ClientSearchThreadBriefVersion = never, TDelivery extends ClientSearchThreadDelivery = never>(search: ClientSearchThreadInput<TTurn, TBriefVersion, TDelivery>): ClientSearchThreadItem<TTurn, TBriefVersion, TDelivery>[];

export { type ClientSearchThreadBriefVersion, type ClientSearchThreadDelivery, type ClientSearchThreadInput, type ClientSearchThreadItem, type ClientSearchThreadTime, type ClientSearchThreadTurn, clientSearchThread };
