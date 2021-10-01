import { haveQueue, inVC, sameVC } from "../../utils/decorators/MusicUtil";
import { DefineCommand } from "../../utils/decorators/DefineCommand";
import { CommandContext } from "../../structures/CommandContext";
import { BaseCommand } from "../../structures/BaseCommand";
import { LoopMode } from "../../typings";
import { createEmbed } from "../../utils/createEmbed";
import i18n from "../../config";

@DefineCommand({
    aliases: ["loop", "music-repeat", "music-loop"],
    description: i18n.__("commands.music.repeat.description"),
    name: "repeat",
    slash: {
        options: [
            {
                description: i18n.__("commands.music.repeat.slashQueue"),
                name: "queue",
                required: false,
                type: "SUB_COMMAND"
            },
            {
                description: i18n.__("commands.music.repeat.slashQueue"),
                name: "song",
                required: false,
                type: "SUB_COMMAND"
            },
            {
                description: i18n.__("commands.music.repeat.slashDisable"),
                name: "disable",
                required: false,
                type: "SUB_COMMAND"
            }
        ]
    }
})
export class RepeatCommand extends BaseCommand {
    @inVC()
    @haveQueue()
    @sameVC()
    public execute(ctx: CommandContext): any {
        const mode: Record<LoopMode, { aliases: string[]; emoji: string }> = {
            OFF: {
                aliases: ["disable", "off"],
                emoji: "▶"
            },
            QUEUE: {
                aliases: ["all", "queue"],
                emoji: "🔁"
            },
            SONG: {
                aliases: ["one", "song"],
                emoji: "🔂"
            }
        };
        const selection = ctx.options?.getSubcommand() || ctx.args[0] ? Object.keys(mode).find(key => mode[key as LoopMode].aliases.includes(ctx.args[0] ?? ctx.options!.getSubcommand())) : undefined;

        if (!selection) return ctx.reply({ embeds: [createEmbed("info", `${mode[ctx.guild!.queue!.loopMode].emoji} **|** ${i18n.__mf("commands.music.repeat.actualMode", { mode: `\`${ctx.guild!.queue!.loopMode}\`` })}`)] });
        ctx.guild!.queue!.loopMode = selection as LoopMode;

        return ctx.reply({ embeds: [createEmbed("info", `${mode[ctx.guild!.queue!.loopMode].emoji} **|** ${i18n.__mf("commands.music.repeat.actualMode", { mode: `\`${ctx.guild!.queue!.loopMode}\`` })}`)] });
    }
}