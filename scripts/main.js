const MODULE_ID = "pf2e-story-feats";
const HEADER_KEY = "PF2E.Actor.Character.FeatSlot.CampaignHeader";
const HEADER_TITLE = "Сюжетные способности";

function applyStoryTitle() {
    if (game.system.id !== "pf2e") return;
    foundry.utils.setProperty(game.i18n.translations, HEADER_KEY, HEADER_TITLE);
}

// Apply after language packages load, independently of their loading order.
Hooks.once("i18nInit", applyStoryTitle);

Hooks.once("ready", async () => {
    if (game.system.id !== "pf2e") return;
    applyStoryTitle();

    // Only a GM may change the existing world setting. Actor and item documents
    // are managed entirely by PF2e's native campaign feat group.
    if (!game.user.isGM) return;
    if (!game.settings.settings.has("pf2e.campaignFeats")) {
        ui.notifications.error(
            "Сюжетные способности: в этой версии PF2e не найдена настройка Campaign Feats."
        );
        return;
    }

    try {
        if (!game.settings.get("pf2e", "campaignFeats")) {
            await game.settings.set("pf2e", "campaignFeats", true);
        }
    } catch (error) {
        console.error(`${MODULE_ID} | Не удалось включить Campaign Feats`, error);
        ui.notifications.error(
            "Сюжетные способности: не удалось включить раздел. Включите Campaign Feats вручную в настройках PF2e → Homebrew Elements → Campaign."
        );
    }
});
