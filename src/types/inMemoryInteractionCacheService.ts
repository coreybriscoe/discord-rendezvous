import { Collection, Snowflake } from 'discord.js';
import { CachedInteraction } from './cachedInteraction.js';
import { InteractionCacheService } from './InteractionCacheService.js';

export class InMemoryInteractionCacheService implements InteractionCacheService {
    private interactionCache: Collection<string, CachedInteraction> = new Collection();

    public cacheInteraction(messageId: Snowflake, cachedInteraction: CachedInteraction): void {
        this.interactionCache.set(messageId, cachedInteraction);
        setTimeout(() => {
            this.interactionCache.delete(messageId);
        }, 14 * 60 * 1000);
    }

    public getCachedInteraction(messageId: Snowflake): CachedInteraction | undefined {
        return this.interactionCache.get(messageId);
    }
}