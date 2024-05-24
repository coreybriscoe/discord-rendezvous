import { Snowflake } from 'discord.js';
import { CachedInteraction } from './cachedInteraction.js';

export interface InteractionCacheService {
    cacheInteraction(messageId: Snowflake, cachedInteraction: CachedInteraction): void;
    getCachedInteraction(messageId: Snowflake): CachedInteraction | undefined;
}