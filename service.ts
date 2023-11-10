interface Feature {
    key: string
    title: string
    explanation: string
    defaultValue: boolean
}

const makeFeatureFlag = (key: string, title: string, explanation: string, defaultValue = true): Feature => {
    return { key, title, explanation, defaultValue }
}

const makeTestSetting = (key: string, title: string, explanation: string, defaultValue = false): Feature => {
    return { key, title, explanation, defaultValue }
}

const Features = {
    DARK_MODE: makeFeatureFlag("feature.darkmode", "Dark theme", "Enabled dark mode"),
    USE_DEVELOP_PORTAL: makeTestSetting("testsetting.usedevelopportal", "Development portal", "Use developer REST endpoint"),
    DEBUG_LOGGING: makeTestSetting("testsetting.debuglogging", "Enable logging", "Print all app logging to console", true),
}

interface FeatureFlagProvider {
    priority: number
    isFeatureEnabled(feature: Feature): boolean
    hasFeature(feature: Feature): boolean
}

class RuntimeBehavior {

    private static providers: FeatureFlagProvider[] = []

    public static isFeatureEnabled(feature: Feature): boolean {
        return this.providers
            .filter(f => f.hasFeature(feature))
            .sort((a, b) => a.priority - b.priority)
            .shift()?.isFeatureEnabled(feature) ?? feature.defaultValue
    }

    public static addProvider(provider: FeatureFlagProvider) {
        this.providers.push(provider)
    }
}

if (RuntimeBehavior.isFeatureEnabled(Features.DARK_MODE)) {
    // set dark theme
} else {
    // set light them
}
