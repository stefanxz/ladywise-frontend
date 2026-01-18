# LadyWise 🌸

LadyWise is a comprehensive women's health application designed to empower users with insights into their menstrual health and potential physiological risks. Beyond standard cycle tracking, LadyWise integrates personalized risk assessments for conditions like anemia and thrombosis, and supports real-time health monitoring through biosensor integration.

## Key Features

- **Smart Cycle Tracking**: Intuitive calendar interface for logging menstruation, symptoms, and daily health metrics.
- **Risk Diagnostics**: Personalized algorithms to assess risks for Anemia and Thrombosis based on family history and daily inputs.
- **Real-Time Health Monitoring**: Integration with biosensor menstrual cups for real-time flow and health data (simulated/integrated via Bluetooth).
- **Secure Data Sharing**: Ability to generate and share clinical reports with healthcare providers.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 50+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: React Context (Auth, Theme, Toast)
- **Testing**: Jest & React Native Testing Library

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- iOS Simulator (Mac only) or Android Emulator
- [Expo Go](https://expo.dev/client) app (for physical devices)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/ladywise-frontend.git
    cd ladywise-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy the example environment file and configure your API endpoints.
    ```bash
    cp .env.example .env
    ```

4.  **Start the development server**
    ```bash
    npx expo start
    ```

    - Press `a` to open in Android Emulator
    - Press `i` to open in iOS Simulator
    - Scan the QR code with Expo Go on your physical device

## Running Tests

We use Jest for unit and component testing.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Project Structure

- `app/`: File-based routing and screen screens.
- `components/`: Reusable UI components.
- `context/`: Global state providers (Auth, Theme).
- `hooks/`: Custom React hooks (logic reuse).
- `lib/`: API clients, types, and utility libraries.
- `constants/`: App-wide constants (Colors, Sizes).
- `assets/`: Images and static files.

## License

This project is proprietary software of LifeSense Group.
