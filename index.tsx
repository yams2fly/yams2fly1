import { definePluginSettings } from "@api/Settings";
import { Notice } from "@components/Notice";
import definePlugin, { OptionType } from "@utils/types";

const PLATFORMS: Record<string, object> = {
    desktop: { browser: "Discord Client" },
    web: { browser: "Discord Web" },
    android: { browser: "Discord Android" },
    ios: { browser: "Discord iOS" },
    vr: {
        os: "android",
        browser: "Discord VR",
        device: "Discord VR"
    },
    hidden: { browser: "" }
};

const settings = definePluginSettings({
    platform: {
        type: OptionType.SELECT,
        description: "The device other people see next to your status.",
        restartNeeded: true,
        options: [
            { label: "Desktop", value: "desktop", default: true },
            { label: "Web", value: "web" },
            { label: "Android", value: "android" },
            { label: "iOS", value: "ios" },
            { label: "VR (experimental)", value: "vr" },
            {
                label: "Hidden (experimental, may still show an icon)",
                value: "hidden"
            }
        ]
    }
});

function SpooferWarning() {
    return (
        <Notice.Warning>
            Discord does not allow pretending to be on another device.
            We cannot guarantee this will not result in account restrictions.
            VR can also cause compatibility issues.
        </Notice.Warning>
    );
}

export default definePlugin({
    name: "PlatformSpoofer",
    description: "Choose which device Discord shows you on.",
    tags: ["Utility"],
    authors: [{ name: "Kittycord", id: 0n }],

    settings,
    settingsAboutComponent: SpooferWarning,

    patches: [
        {
            find: "capabilities:1767421",
            replacement: [
                {
                    match: /properties:(\w+),presence:(\w+),compress:/,
                    replace: "properties:$self.spoof($1),presence:$2,compress:"
                }
            ]
        }
    ],

    spoof(properties: object) {
        const platform = settings.store.platform;
        return {
            ...properties,
            ...(PLATFORMS[platform] ?? PLATFORMS.desktop)
        };
    }
});
