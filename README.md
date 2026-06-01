# TranquiLED

TranquiLED is a desktop productivity tool designed to enhance focus and promote relaxation. Using the subtle yet effective method of a gently pulsing LED on your screen, it mimics the rhythm of a calming heartbeat. This digital adaptation of a proven focus technique is ideal for those seeking to maintain concentration and reduce stress during work or study sessions.

Inspired by this [HN post](https://news.ycombinator.com/item?id=38276107)
## Features

- **Heartbeat Rhythm**: A screen-corner LED blinks rapidly and then gradually slows down to 1 blink per second, simulating a calming heartbeat rhythm.
- **Customizable Speed**: Adjust the initial fast blinking rate, the time it takes to slow down to 1/second, and how long it stays at steady pace before fading out — all from the system tray menu.
- **Automatic Fade-Out**: After reaching a calm pace and holding it for a configurable duration, the LED fades away gently.
- **System Tray Controls**: Right-click the tray icon to adjust settings, restart the heartbeat, or quit.
- **Click-Through Window**: The LED overlay doesn't interfere with clicking on anything beneath it.
- **Multi-Display Support**: Works across multiple monitors, placing an LED on each screen.
- **Global Keyboard Shortcut**: Toggle the LED on or off with `Ctrl+Shift+L`.

## Getting Started

### Prerequisites

- Node.js
- Electron

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/TranquiLED.git
   ```
2. Navigate to the project directory:
   ```bash
   cd TranquiLED
   ```
3. Install NPM packages:
   ```bash
   npm install
   ```

### Running the Application

To start the application, run:
```bash
npm start
```

## Usage

After launching TranquiLED, an LED will appear in the bottom-right corner of your screen. It starts blinking fast and gradually slows down to 1 blink per second over the configured slowdown time. After holding at that steady pace, it fades out automatically.

### Tray Menu Settings

Right-click the red dot in your system tray to configure:

| Setting | Options |
|---------|---------|
| Initial Blink Rate | 10/sec, 5/sec, 3/sec |
| Slowdown Time | 30 seconds, 1 minute, 2 minutes, 5 minutes |
| Steady Time Before Fade | 1 minute, 2 minutes, 5 minutes, Never |

### Keyboard Shortcut

- `Ctrl+Shift+L` — Toggle the LED on or off

## Contributing

Contributions to TranquiLED are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

