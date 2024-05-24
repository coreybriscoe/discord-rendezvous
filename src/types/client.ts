import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { RendezvousSlashCommand } from '../rendezvous/rendezvousCommand.js';
import { OutcomeTypeConstraint } from './outcome.js';
import CustomButton from '../buttons/architecture/CustomButton.js';

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
    private commands: Collection<string, RdvsSlashCommandAlias>;
    private buttons: Collection<string, CustomButton>;
    private static intents: GatewayIntentBits[];

    private constructor() {
        super({
            intents: RendezvousClient.intents,
        });
        this.commands = new Collection();
        this.buttons = new Collection();
        RendezvousClient.instance = this;
    }

    public static addIntents(intents: GatewayIntentBits[]): void {
        RendezvousClient.intents = RendezvousClient.intents.concat(intents);
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