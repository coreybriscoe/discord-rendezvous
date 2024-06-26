import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';
import CustomButton from './architecture/CustomButton.js';
import { isEmbedDescribedOutcome } from '../rendezvous/outcome.js';
import { InteractionCacheServiceLocator } from '../caching/InteractionCacheServiceLocator.js';

const previousButton = new CustomButton(
    new ButtonBuilder()
        .setCustomId('rendezvous-navigation-previous')
        .setLabel('◀️ Previous')
        .setStyle(ButtonStyle.Primary),
    async (interaction: ButtonInteraction) => {
        // Find cached data for this original interaction
        const cached = InteractionCacheServiceLocator.getService().getCachedInteraction(interaction.message.interaction!.id);
        if (!cached) {
            await interaction.reply({ content: 'This interaction has expired!', ephemeral: true });
            return;
        }
        const newPage = Math.max(cached.solverParams.page - 1, 0);
        // Re-run the solver to get the new page
        const describedOutcome = await cached.solveAgainAndDescribe(newPage);
        // Update the original interaction
        if (isEmbedDescribedOutcome(describedOutcome)) {
            interaction.update({ embeds: describedOutcome.embeds, components: describedOutcome.components });
        } else {
            interaction.update({ content: describedOutcome.userMessage });
        }
        // Update the cached interaction with the new page number
        cached.setPage(newPage);
    }
);

export default previousButton;