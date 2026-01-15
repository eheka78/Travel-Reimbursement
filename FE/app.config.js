import "dotenv/config";

export default {
    expo: {
        name: "Travel-Reimbursement",
        slug: "Travel-Reimbursement",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,

        splash: {
            image: "./assets/icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },

        ios: {
            bundleIdentifier: "com.ddkim78.travelreimbursement",
            supportsTablet: true,
        },

        android: {
            usesCleartextTraffic: true,
            adaptiveIcon: {
                foregroundImage: "./assets/icon.png",
                backgroundColor: "#ffffff",
            },
            edgeToEdgeEnabled: true,
            package: "com.ddkim78.TravelReimbursement",
        },

        web: {
            favicon: "./assets/icon.png",
        },

        extra: {
            API_URL: process.env.EXPO_PUBLIC_API_URL,

            eas: {
                projectId: "b213e4d7-92b5-4994-80ce-5f717f3fb773",
            },
        },

        owner: "ddkim78",
    },
};
