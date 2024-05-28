import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { RendezvousSlashCommand } from './rendezvous/rendezvousCommand.js';
import { OutcomeTypeConstraint } from './rendezvous/outcome.js';
import CustomButton from './buttons/architecture/CustomButton.js';
import firstButton from './buttons/first.js';
import lastButton from './buttons/last.js';
import nextButton from './buttons/next.js';
import previousButton from './buttons/previous.js';

// Type alias for RendezvousSlashCommand with unknown generic parameters.
type RdvsSlashCommandAlias = RendezvousSlashCommand<OutcomeTypeConstraint, unknown, unknown>;

type SlashCommandCollectionPair = {
    name: string;
    command: RdvsSlashCommandAlias;
}

type ButtonCollectionPair = {
    customId: string;
    button: CustomButton;
}

export class RendezvousClient extends Client {
    private static instance: RendezvousClient;
    private commands: Collection<string, RdvsSlashCommandAlias> = new Collection();
    private buttons: Collection<string, CustomButton> = new Collection();
    private static intents: GatewayIntentBits[] = [];
    private static addBuiltInButtons: boolean = true;

    private constructor() {
        super({
            intents: RendezvousClient.intents,
        });
        if (RendezvousClient.addBuiltInButtons) {
            this.buttons = new Collection([
                [firstButton.getCustomId(), firstButton],
                [lastButton.getCustomId(), lastButton],
                [nextButton.getCustomId(), nextButton],
                [previousButton.getCustomId(), previousButton],
            ]);
        }
        RendezvousClient.instance = this;
    }

    public static addIntents(intents: GatewayIntentBits[]): void {
        RendezvousClient.intents = RendezvousClient.intents.concat(intents);
    }

    // TODO: This behavior better suited in e.g. a builder pattern
    public static excludeBuiltInButtons(): void {
        if (RendezvousClient.instance) throw new Error('Error in client.ts: This method must be called before singleton instantiation.');
        RendezvousClient.addBuiltInButtons = false;
    }

    public addCommands(commands: SlashCommandCollectionPair[]): void {
        commands.forEach(com => {
            this.commands.set(com.name, com.command);
        });
    }

    public getCommands(): Collection<string, RdvsSlashCommandAlias> {
        return this.commands;
    }

    public getCommand(name: string): RdvsSlashCommandAlias | undefined {
        return this.commands.get(name);
    }

    public addButtons(buttons: ButtonCollectionPair[]): void {
        buttons.forEach(btn => {
            this.buttons.set(btn.customId, btn.button);
        });
    }

    public getButton(customId: string): CustomButton | undefined {
        return this.buttons.get(customId);
    }

    public static async getInstance(): Promise<RendezvousClient> {
        if (!RendezvousClient.instance) {
            RendezvousClient.instance = new RendezvousClient();
        }
        return RendezvousClient.instance;
    }
}